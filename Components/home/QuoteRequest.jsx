"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { DateRangePicker } from "@heroui/date-picker";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";
import axios from "axios";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  mobileno: "",
  propertyType: "",
  selectedRoom: "",
  eventType: "",
  eventStartDate: "",
  eventEndDate: "",
  notes: "",
  paymentReceipt: null,
  paidAmount: "",
  intendsToPay: false,
  consentAccepted: false,
};

export default function QuoteRequest() {
  const [formData, setFormData] = useState({ ...INITIAL_FORM });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, roomsRes, paymentRes] = await Promise.all([
          axios.get("/api/settings/rooms"),
          axios.get("/api/rooms"),
          axios.get("/api/public/payment-settings"),
        ]);

        if (settingsRes.data.success) {
          setPropertyTypes(settingsRes.data.settings.propertyTypes || []);
          setEventTypes(settingsRes.data.settings.eventTypes || []);
        }
        if (roomsRes.data.success) setRooms(roomsRes.data.rooms || []);
        if (paymentRes.data.success) setPaymentSettings(paymentRes.data);
      } catch (error) {
        console.error("Error fetching quote form data:", error);
      }
    };
    fetchData();
  }, []);

  const calculateAdvance = () => {
    if (formData.selectedRoom) {
      const room = rooms.find((r) => r._id === formData.selectedRoom);
      return room ? Math.round(room.price / 2) : "";
    }
    return "";
  };

  useEffect(() => {
    if (formData.intendsToPay && formData.selectedRoom) {
      setFormData((prev) => ({ ...prev, paidAmount: calculateAdvance() }));
    }
  }, [formData.selectedRoom, formData.intendsToPay, rooms]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleReceiptUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }
    setFormData((prev) => ({ ...prev, paymentReceipt: file }));
    if (errors.paymentReceipt)
      setErrors((prev) => ({ ...prev, paymentReceipt: null }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Required";
    if (!formData.lastName.trim()) newErrors.lastName = "Required";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid format";
    if (!formData.mobileno) newErrors.mobileno = "Required";
    else if (!/^\d{10}$/.test(formData.mobileno))
      newErrors.mobileno = "10 digits required";
    if (!formData.propertyType) newErrors.propertyType = "Required";
    if (!formData.selectedRoom) newErrors.selectedRoom = "Required";
    if (!formData.eventType) newErrors.eventType = "Required";
    if (!formData.eventStartDate) newErrors.eventDate = "Required";
    if (!formData.consentAccepted) newErrors.consentAccepted = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.paidAmount || Number(formData.paidAmount) <= 0)
      newErrors.paidAmount = "Enter valid amount";
    if (!formData.paymentReceipt)
      newErrors.paymentReceipt = "Upload payment screenshot";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = async () => {
    if (formData.intendsToPay && !validateStep2()) return;

    setLoading(true);
    setSubmitMessage({ type: "", text: "" });
    try {
      const data = new FormData();
      data.append("firstName", formData.firstName.trim());
      data.append("lastName", formData.lastName.trim());
      data.append("mobileno", formData.mobileno);
      data.append("email", formData.email);
      data.append("propertyType", formData.propertyType);
      data.append("selectedRoom", formData.selectedRoom);
      data.append("eventType", formData.eventType);
      data.append("eventStartDate", formData.eventStartDate);
      data.append("eventEndDate", formData.eventEndDate);
      data.append("notes", formData.notes);
      data.append("consentAccepted", String(formData.consentAccepted));
      data.append("consentTimestamp", new Date().toISOString());

      if (formData.intendsToPay) {
        data.append("paidAmount", formData.paidAmount);
        if (formData.paymentReceipt) {
          data.append("paymentReceipt", formData.paymentReceipt);
        }
      } else {
        data.append("paidAmount", "0");
      }

      const res = await axios.post("/api/crm", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setSubmitMessage({
          type: "success",
          text: "Thank you! We will contact you soon.",
        });
        setFormData({ ...INITIAL_FORM });
        setStep(1);
        setErrors({});
      }
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Error submitting. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = formData.propertyType
    ? rooms.filter(
        (r) => r.type.toLowerCase() === formData.propertyType.toLowerCase(),
      )
    : [];

  /* ── Payment details renderer ── */
  const renderPaymentDetails = () => {
    if (!paymentSettings?.paymentMethod) return null;
    return (
      <div className="w-full space-y-4">
        {paymentSettings.paymentMethod === "upiQrCode" &&
          paymentSettings.upiQrCode && (
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-[2rem] shadow-2xl ring-8 ring-white/5">
                <Image
                  src={paymentSettings.upiQrCode}
                  alt="QR"
                  width={176}
                  height={176}
                  sizes="(max-width: 640px) 160px, 176px"
                  className="w-40 h-40 sm:w-44 sm:h-44 object-contain"
                />
              </div>
            </div>
          )}

        {paymentSettings.paymentMethod === "upiQrCode" &&
          paymentSettings.upiId && (
            <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1">
                Business UPI ID
              </p>
              <p className="font-mono text-white text-sm select-all break-all">
                {paymentSettings.upiId}
              </p>
            </div>
          )}

        {paymentSettings.paymentMethod === "upiId" && (
          <div className="text-center p-5 bg-white/5 rounded-2xl border border-hotel-primary/20">
            <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-2">
              Pay via UPI ID
            </p>
            <p className="font-mono text-hotel-primary text-lg font-bold select-all break-all">
              {paymentSettings.upiId}
            </p>
            <p className="text-[10px] text-white/30 mt-1">
              Copy and pay using any UPI app
            </p>
          </div>
        )}

        {paymentSettings.paymentMethod === "bankDetails" && (
          <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-3">
            <p className="text-[10px] text-white/30 uppercase font-black tracking-widest text-center mb-2">
              Bank Transfer Details
            </p>
            <div className="space-y-2">
              {[
                {
                  label: "Account Holder",
                  value: paymentSettings.accountHolderName,
                },
                {
                  label: "Account No.",
                  value: paymentSettings.accountNumber,
                  mono: true,
                },
                {
                  label: "IFSC Code",
                  value: paymentSettings.ifscCode,
                  mono: true,
                },
                paymentSettings.bankBranch && {
                  label: "Branch",
                  value: paymentSettings.bankBranch,
                },
              ]
                .filter(Boolean)
                .map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between items-center text-sm gap-2"
                  >
                    <span className="text-white/40 shrink-0">{row.label}</span>
                    <span
                      className={`text-white font-semibold text-right break-all ${
                        row.mono ? "font-mono" : ""
                      }`}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
            </div>
            <p className="text-[10px] text-white/30 text-center mt-2">
              Transfer via NEFT / IMPS / RTGS
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.section
      className="p-4 sm:p-8 md:p-12 lg:py-24 relative min-h-screen flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/contact/1.jpg"
          alt="Luxury Venue"
          fill
          className="object-cover scale-105"
          priority
        />
        <div className="absolute inset-0 bg-black/80 backdrop-blur-[4px] lg:backdrop-blur-[2px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        <div className="grid lg:grid-cols-2 rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-white/5 backdrop-blur-xl border border-white/10">
          {/* Visual Panel */}
          <div className="relative hidden lg:block h-full min-h-[700px]">
            <Image
              src="/contact/2.jpg"
              alt="Celebration"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-hotel-primary/10 mix-blend-overlay" />
            <div className="absolute bottom-12 left-12 right-12">
              <div className="w-12 h-1 bg-hotel-primary mb-6" />
              <h3 className="text-4xl font-serif text-white leading-tight mb-4">
                Elevating Every
                <br />
                Single Moment
              </h3>
              <p className="text-white/60 text-lg font-light max-w-sm">
                From intimate gatherings to grand celebrations, we bring your
                vision to life.
              </p>
            </div>
          </div>

          {/* Form Panel */}
          <div className="p-6 sm:p-10 lg:p-16 flex flex-col justify-center">
            <div className="mb-10">
              <span className="text-hotel-primary uppercase tracking-[0.3em] text-[10px] font-bold block mb-2">
                Concierge Service
              </span>
              <h2 className="text-4xl font-serif text-white tracking-tight">
                Request A Quote
              </h2>
            </div>

            {submitMessage.text && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 mb-8 rounded-2xl text-center text-sm font-medium border ${
                  submitMessage.type === "error"
                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                    : "bg-green-500/10 text-green-400 border-green-500/20"
                }`}
              >
                {submitMessage.text}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="qstep1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      variant="underlined"
                      className="dark"
                      classNames={{
                        input: "text-white",
                        label: "text-white/50",
                      }}
                      isInvalid={!!errors.firstName}
                      errorMessage={errors.firstName}
                    />
                    <Input
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      variant="underlined"
                      className="dark"
                      classNames={{ input: "text-white" }}
                      isInvalid={!!errors.lastName}
                      errorMessage={errors.lastName}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Email Address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      variant="underlined"
                      className="dark"
                      isInvalid={!!errors.email}
                      errorMessage={errors.email}
                    />
                    <Input
                      label="Mobile Number"
                      name="mobileno"
                      value={formData.mobileno}
                      onChange={(e) => {
                        const val = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                        setFormData((p) => ({ ...p, mobileno: val }));
                        if (errors.mobileno)
                          setErrors((p) => ({ ...p, mobileno: null }));
                      }}
                      variant="underlined"
                      className="dark"
                      isInvalid={!!errors.mobileno}
                      errorMessage={errors.mobileno}
                      placeholder="10 digit number"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Select
                      label="Property Category"
                      name="propertyType"
                      variant="underlined"
                      className="dark"
                      selectedKeys={
                        formData.propertyType
                          ? [formData.propertyType.toLowerCase()]
                          : []
                      }
                      onChange={(e) => {
                        handleChange(e);
                        setFormData((p) => ({ ...p, selectedRoom: "" }));
                      }}
                      isInvalid={!!errors.propertyType}
                      errorMessage={errors.propertyType}
                    >
                      {propertyTypes.map((t) => (
                        <SelectItem
                          key={t.name.toLowerCase()}
                          textValue={t.name}
                        >
                          {t.name}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      label="Specific Space"
                      name="selectedRoom"
                      variant="underlined"
                      className="dark"
                      selectedKeys={
                        formData.selectedRoom ? [formData.selectedRoom] : []
                      }
                      onChange={handleChange}
                      isDisabled={!formData.propertyType}
                      isInvalid={!!errors.selectedRoom}
                      errorMessage={errors.selectedRoom}
                    >
                      {filteredRooms.map((r) => (
                        <SelectItem key={r._id} textValue={r.name}>
                          {`${r.name} (₹${r.price.toLocaleString()})`}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Select
                      label="Event Type"
                      name="eventType"
                      variant="underlined"
                      className="dark"
                      selectedKeys={
                        formData.eventType
                          ? [formData.eventType.toLowerCase()]
                          : []
                      }
                      onChange={handleChange}
                      isInvalid={!!errors.eventType}
                      errorMessage={errors.eventType}
                    >
                      {eventTypes.map((t) => (
                        <SelectItem
                          key={t.name.toLowerCase()}
                          textValue={t.name}
                        >
                          {t.name}
                        </SelectItem>
                      ))}
                    </Select>
                    <DateRangePicker
                      label="Desired Dates"
                      variant="underlined"
                      className="dark pt-1"
                      onChange={(r) => {
                        if (r?.start && r?.end) {
                          setFormData((p) => ({
                            ...p,
                            eventStartDate: new Date(
                              r.start.year,
                              r.start.month - 1,
                              r.start.day,
                            ).toISOString(),
                            eventEndDate: new Date(
                              r.end.year,
                              r.end.month - 1,
                              r.end.day,
                            ).toISOString(),
                          }));
                          if (errors.eventDate)
                            setErrors((p) => ({ ...p, eventDate: null }));
                        }
                      }}
                      isInvalid={!!errors.eventDate}
                      errorMessage={errors.eventDate}
                    />
                  </div>

                  <Textarea
                    label="Special Requests"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    variant="underlined"
                    className="dark"
                  />

                  {/* Pay advance opt-in */}
                  {paymentSettings?.paymentMethod && (
                    <div
                      onClick={() =>
                        setFormData((p) => ({
                          ...p,
                          intendsToPay: !p.intendsToPay,
                        }))
                      }
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        formData.intendsToPay
                          ? "border-hotel-primary bg-hotel-primary/10"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          isSelected={formData.intendsToPay}
                          color="warning"
                        />
                        <p className="text-white text-sm font-medium">
                          Secure this date with an advance?
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Show payment details inline when checked */}
                  {formData.intendsToPay && renderPaymentDetails()}

                  {/* Consent */}
                  <div className="pb-4">
                    <Checkbox
                      isSelected={formData.consentAccepted}
                      onValueChange={(v) => {
                        setFormData((p) => ({ ...p, consentAccepted: v }));
                        if (errors.consentAccepted)
                          setErrors((p) => ({ ...p, consentAccepted: null }));
                      }}
                      color="warning"
                    >
                      <span className="text-white/50 text-xs">
                        Accept{" "}
                        <a
                          href="/policies"
                          className="text-hotel-primary underline font-bold"
                        >
                          Privacy & Terms
                        </a>{" "}
                        *
                      </span>
                    </Checkbox>
                    {errors.consentAccepted && (
                      <p className="text-red-400 text-[10px] mt-1 uppercase font-bold tracking-widest">
                        Action Required
                      </p>
                    )}
                  </div>

                  <Button
                    onPress={() => {
                      if (!validateStep1()) return;
                      if (formData.intendsToPay) {
                        setErrors({});
                        setStep(2);
                      } else {
                        submitForm();
                      }
                    }}
                    isLoading={loading}
                    className="w-full bg-hotel-primary text-black font-black py-8 rounded-2xl shadow-[0_10px_30px_rgba(var(--hotel-primary-rgb),0.3)] hover:scale-[1.02] active:scale-[0.98] transition-transform text-lg"
                  >
                    {formData.intendsToPay
                      ? "Continue to Payment"
                      : "Get Proposal"}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="qstep2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <Button
                    variant="light"
                    onPress={() => {
                      setStep(1);
                      setErrors({});
                    }}
                    className="text-hotel-primary text-xs self-start -ml-4"
                    startContent={
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                      </svg>
                    }
                  >
                    Back to Proposal
                  </Button>

                  <div className="w-full p-6 bg-white/5 border border-dashed border-hotel-primary/30 rounded-3xl text-center">
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-2 font-bold">
                      Priority Booking Deposit (50%)
                    </p>
                    <p className="text-4xl font-black text-hotel-primary leading-none">
                      ₹{calculateAdvance().toLocaleString()}
                    </p>
                  </div>

                  {/* Payment details — always visible on step 2 */}
                  {renderPaymentDetails()}

                  <div className="space-y-4">
                    <Input
                      label="Amount Transferred (₹)"
                      name="paidAmount"
                      type="number"
                      value={formData.paidAmount}
                      onChange={handleChange}
                      variant="underlined"
                      className="dark"
                      startContent={<span className="text-white/30">₹</span>}
                      isInvalid={!!errors.paidAmount}
                      errorMessage={errors.paidAmount}
                    />

                    <div
                      className={`relative group border-2 border-dashed bg-white/5 rounded-2xl p-6 text-center transition-all ${
                        errors.paymentReceipt
                          ? "border-red-400"
                          : "border-white/10 hover:border-hotel-primary/50"
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleReceiptUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center gap-2">
                        <svg
                          className={`w-8 h-8 ${
                            formData.paymentReceipt
                              ? "text-green-500"
                              : "text-white/20 group-hover:text-hotel-primary/50"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          />
                        </svg>
                        <p
                          className={`text-sm ${
                            formData.paymentReceipt
                              ? "text-green-500"
                              : "text-white/40"
                          }`}
                        >
                          {formData.paymentReceipt
                            ? `✓ ${formData.paymentReceipt.name}`
                            : "Upload Payment Receipt *"}
                        </p>
                      </div>
                    </div>
                    {errors.paymentReceipt && (
                      <p className="text-red-400 text-[10px] italic text-center">
                        {errors.paymentReceipt}
                      </p>
                    )}
                  </div>

                  <Button
                    onPress={submitForm}
                    isLoading={loading}
                    className="w-full bg-hotel-primary text-black font-black py-8 rounded-2xl text-lg mt-4"
                  >
                    Confirm Booking
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
