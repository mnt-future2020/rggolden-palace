"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { DateRangePicker } from "@heroui/date-picker";
import { Checkbox } from "@heroui/checkbox";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  mobileno: "",
  email: "",
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

const ContactForm = () => {
  const [formData, setFormData] = useState({ ...INITIAL_FORM });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [paymentSettings, setPaymentSettings] = useState(null);
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
        console.error("Error fetching form data:", error);
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
    setMessage({ type: "", text: "" });
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
        setMessage({ type: "success", text: "Sent successfully!" });
        setFormData({ ...INITIAL_FORM });
        setStep(1);
        setErrors({});
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to submit. Please try again.",
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
              <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl ring-12 ring-white/5">
                <img
                  src={paymentSettings.upiQrCode}
                  alt="QR"
                  className="w-40 h-40 sm:w-48 sm:h-48 object-contain"
                />
              </div>
            </div>
          )}

        {paymentSettings.paymentMethod === "upiQrCode" &&
          paymentSettings.upiId && (
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl text-center">
              <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest mb-1">
                Business UPI ID
              </p>
              <p className="font-mono text-white text-sm select-all break-all">
                {paymentSettings.upiId}
              </p>
            </div>
          )}

        {paymentSettings.paymentMethod === "upiId" && (
          <div className="bg-white/5 border border-hotel-primary/20 p-5 rounded-2xl text-center">
            <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest mb-2">
              Pay via UPI ID
            </p>
            <p className="font-mono text-hotel-primary text-lg font-bold select-all break-all">
              {paymentSettings.upiId}
            </p>
            <p className="text-[10px] text-white/20 mt-1">
              Copy and pay using any UPI app
            </p>
          </div>
        )}

        {paymentSettings.paymentMethod === "bankDetails" && (
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-3">
            <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest text-center mb-2">
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
            <p className="text-[10px] text-white/20 text-center mt-2">
              Transfer via NEFT / IMPS / RTGS
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#1a1a1a] text-white p-6 sm:p-10 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/5 relative group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-hotel-primary/10 blur-[80px] -mr-16 -mt-16 group-hover:bg-hotel-primary/20 transition-all duration-700" />

      <div className="relative z-10">
        <h2 className="text-3xl font-serif mb-2 tracking-tight">
          Ready to Book?
        </h2>
        <p className="text-white/40 mb-10 text-sm font-light">
          Fill in the details and we&apos;ll handle the rest
        </p>

        {message.text && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mb-8 p-4 rounded-2xl text-center text-sm font-medium border ${
              message.type === "success"
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}
          >
            {message.text}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  variant="bordered"
                  className="dark"
                  isInvalid={!!errors.firstName}
                  errorMessage={errors.firstName}
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  variant="bordered"
                  className="dark"
                  isInvalid={!!errors.lastName}
                  errorMessage={errors.lastName}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Phone Number"
                  name="mobileno"
                  value={formData.mobileno}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setFormData((p) => ({ ...p, mobileno: val }));
                    if (errors.mobileno)
                      setErrors((p) => ({ ...p, mobileno: null }));
                  }}
                  variant="bordered"
                  className="dark"
                  isInvalid={!!errors.mobileno}
                  errorMessage={errors.mobileno}
                  placeholder="10 digits"
                />
                <Input
                  label="Email (Optional)"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="bordered"
                  className="dark"
                  isInvalid={!!errors.email}
                  errorMessage={errors.email}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Select
                  label="Category"
                  name="propertyType"
                  variant="bordered"
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
                    <SelectItem key={t.name.toLowerCase()} textValue={t.name}>
                      {t.name}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label="Specific Unit"
                  name="selectedRoom"
                  variant="bordered"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Select
                  label="Event Type"
                  name="eventType"
                  variant="bordered"
                  className="dark"
                  selectedKeys={
                    formData.eventType ? [formData.eventType.toLowerCase()] : []
                  }
                  onChange={handleChange}
                  isInvalid={!!errors.eventType}
                  errorMessage={errors.eventType}
                >
                  {eventTypes.map((t) => (
                    <SelectItem key={t.name.toLowerCase()} textValue={t.name}>
                      {t.name}
                    </SelectItem>
                  ))}
                </Select>
                <DateRangePicker
                  label="Event Dates"
                  variant="bordered"
                  className="dark"
                  onChange={(range) => {
                    if (range?.start && range?.end) {
                      setFormData((p) => ({
                        ...p,
                        eventStartDate: new Date(
                          range.start.year,
                          range.start.month - 1,
                          range.start.day,
                        ).toISOString(),
                        eventEndDate: new Date(
                          range.end.year,
                          range.end.month - 1,
                          range.end.day,
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
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Share your requirements..."
                variant="bordered"
                className="dark"
              />

              {/* Pay advance opt-in */}
              {paymentSettings?.paymentMethod && (
                <div
                  className={`p-5 rounded-[1.5rem] border-2 transition-all cursor-pointer ${
                    formData.intendsToPay
                      ? "border-hotel-primary bg-hotel-primary/10"
                      : "border-white/5 bg-white/5 hover:border-white/10"
                  }`}
                  onClick={() =>
                    setFormData((p) => ({
                      ...p,
                      intendsToPay: !p.intendsToPay,
                    }))
                  }
                >
                  <div className="flex items-center gap-4">
                    <Checkbox
                      isSelected={formData.intendsToPay}
                      color="warning"
                    />
                    <div>
                      <p className="font-semibold text-sm">
                        Pay 50% Advance Now?
                      </p>
                      <p className="text-[10px] text-white/40 uppercase tracking-tighter">
                        Instant booking confirmation
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Show payment details inline when checked */}
              {formData.intendsToPay && renderPaymentDetails()}

              {/* Consent */}
              <div className="pt-2">
                <Checkbox
                  isSelected={formData.consentAccepted}
                  onValueChange={(v) => {
                    setFormData((prev) => ({ ...prev, consentAccepted: v }));
                    if (errors.consentAccepted)
                      setErrors((p) => ({ ...p, consentAccepted: null }));
                  }}
                  color="warning"
                >
                  <span className="text-xs text-white/40">
                    I agree to the{" "}
                    <a
                      href="/policies"
                      className="text-hotel-primary font-bold underline"
                    >
                      Privacy & Terms
                    </a>{" "}
                    *
                  </span>
                </Checkbox>
                {errors.consentAccepted && (
                  <p className="text-red-400 text-[10px] mt-1 uppercase font-bold tracking-widest">
                    Acknowledgment required
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
                className="w-full bg-hotel-primary text-black font-black h-14 rounded-2xl mt-6 shadow-xl shadow-hotel-primary/10 active:scale-[0.98] transition-all"
              >
                {formData.intendsToPay
                  ? "Proceed to Payment"
                  : "Submit Request"}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
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
                Back to Details
              </Button>

              <div className="w-full p-6 bg-white/5 border border-dashed border-hotel-primary/30 rounded-3xl text-center">
                <p className="text-xs text-white/30 uppercase tracking-[0.2em] mb-2 font-bold">
                  Booking Deposit (50%)
                </p>
                <p className="text-4xl font-black text-hotel-primary">
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
                  variant="bordered"
                  className="dark"
                  startContent={<span className="text-white/30">₹</span>}
                  isInvalid={!!errors.paidAmount}
                  errorMessage={errors.paidAmount}
                />

                <div
                  className={`relative border-2 border-dashed bg-white/5 rounded-2xl p-6 text-center transition-all group ${
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
                      className={`w-10 h-10 ${
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
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <p
                      className={`text-sm font-medium ${
                        formData.paymentReceipt
                          ? "text-green-500"
                          : "text-white/30"
                      }`}
                    >
                      {formData.paymentReceipt
                        ? `✓ ${formData.paymentReceipt.name}`
                        : "Upload Payment Screenshot *"}
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
                className="w-full bg-hotel-primary text-black font-black h-16 rounded-2xl text-xl shadow-2xl shadow-hotel-primary/20 mt-4"
              >
                Confirm & Finalize
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContactForm;
