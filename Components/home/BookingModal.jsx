"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
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

export default function BookingModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ ...INITIAL_FORM });
  const [rooms, setRooms] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const [paymentSettings, setPaymentSettings] = useState(null);

  const calculateAdvance = () => {
    if (formData.selectedRoom) {
      const room = rooms.find((r) => r._id === formData.selectedRoom);
      return room ? Math.round(room.price / 2) : "";
    }
    return "";
  };

  useEffect(() => {
    if (formData.intendsToPay && formData.selectedRoom) {
      const advance = calculateAdvance();
      setFormData((prev) => ({ ...prev, paidAmount: advance }));
    }
  }, [formData.selectedRoom, formData.intendsToPay, rooms]);

  useEffect(() => {
    if (!isOpen) return;

    setFormData({ ...INITIAL_FORM });
    setStep(1);
    setMessage({ type: "", text: "" });
    setErrors({});

    const fetchSettings = async () => {
      try {
        const [settingsRes, roomsRes] = await Promise.all([
          axios.get("/api/settings/rooms"),
          axios.get("/api/rooms"),
        ]);
        if (settingsRes.data.success) {
          const settings = settingsRes.data.settings;
          setPropertyTypes(settings.propertyTypes || []);
          setEventTypes(settings.eventTypes || []);
        }
        if (roomsRes.data.success) {
          setRooms(roomsRes.data.rooms || []);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    const fetchPaymentSettings = async () => {
      try {
        const { data } = await axios.get("/api/public/payment-settings");
        if (data.success) setPaymentSettings(data);
      } catch (err) {
        console.error("Error fetching payment settings:", err);
      }
    };

    fetchSettings();
    fetchPaymentSettings();
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleReceiptUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }
    setFormData((prev) => ({ ...prev, paymentReceipt: file }));
    if (errors.paymentReceipt)
      setErrors((prev) => ({ ...prev, paymentReceipt: null }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.mobileno) newErrors.mobileno = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.mobileno))
      newErrors.mobileno = "Invalid phone format";
    if (!formData.propertyType)
      newErrors.propertyType = "Property type is required";
    if (!formData.selectedRoom) newErrors.selectedRoom = "Please select a unit";
    if (!formData.eventType) newErrors.eventType = "Event type is required";
    if (!formData.eventStartDate)
      newErrors.eventDate = "Event date is required";
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

  const submitBooking = async () => {
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

      const response = await axios.post("/api/crm", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setMessage({
          type: "success",
          text: "Booking request submitted successfully!",
        });
        setTimeout(() => onClose(), 2000);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!validateStep1()) return;
    if (formData.intendsToPay) {
      setErrors({});
      setStep(2);
    } else {
      submitBooking();
    }
  };

  const filteredRooms = formData.propertyType
    ? rooms.filter(
        (r) => r.type.toLowerCase() === formData.propertyType.toLowerCase(),
      )
    : [];

  const renderPaymentDetails = () => {
    if (!paymentSettings?.paymentMethod) return null;
    return (
      <div className="space-y-3">
        {/* UPI QR Code */}
        {paymentSettings.paymentMethod === "upiQrCode" &&
          paymentSettings.upiQrCode && (
            <div className="flex justify-center">
              <div className="bg-white p-3 rounded-xl border shadow-md">
                <Image
                  src={paymentSettings.upiQrCode}
                  alt="UPI QR"
                  width={192}
                  height={192}
                  sizes="(max-width: 640px) 160px, 192px"
                  className="w-40 h-40 sm:w-48 sm:h-48 object-contain"
                />
              </div>
            </div>
          )}

        {/* UPI ID alongside QR */}
        {paymentSettings.paymentMethod === "upiQrCode" &&
          paymentSettings.upiId && (
            <div className="text-center p-3 bg-gray-50 rounded-lg border">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                UPI ID
              </p>
              <p className="font-mono text-sm font-bold text-gray-800 select-all break-all">
                {paymentSettings.upiId}
              </p>
            </div>
          )}

        {/* Standalone UPI ID */}
        {paymentSettings.paymentMethod === "upiId" && (
          <div className="text-center p-4 bg-gray-50 rounded-lg border">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
              Pay via UPI ID
            </p>
            <p className="font-mono text-base font-bold text-hotel-primary select-all break-all">
              {paymentSettings.upiId}
            </p>
            <p className="text-[10px] text-gray-400 mt-1">
              Copy and pay using any UPI app
            </p>
          </div>
        )}

        {/* Bank Details */}
        {paymentSettings.paymentMethod === "bankDetails" && (
          <div className="p-4 bg-gray-50 rounded-lg border space-y-2">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider text-center mb-2">
              Bank Transfer Details
            </p>
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
                  className="flex justify-between items-center gap-2 text-sm"
                >
                  <span className="text-gray-500 shrink-0">{row.label}</span>
                  <span
                    className={`font-semibold text-gray-800 text-right break-all ${
                      row.mono ? "font-mono" : ""
                    }`}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            <p className="text-[10px] text-gray-400 text-center pt-1">
              Transfer via NEFT / IMPS / RTGS
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg overflow-hidden w-full max-w-[1000px] max-h-[95vh] sm:max-h-[90vh] relative flex flex-col"
          >
            <div className="grid md:grid-cols-2 flex-1 overflow-hidden">
              {/* ── Image Panel ── */}
              <div className="relative hidden md:block">
                <Image
                  src="/contact/2.jpg"
                  alt="Wedding ceremony"
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              {/* ── Form Panel ── */}
              <div className="flex flex-col h-full max-h-[95vh] sm:max-h-[90vh] md:max-h-none overflow-hidden">
                {/* Header */}
                <div className="p-3 sm:p-4 border-b shrink-0">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-serif">
                      {step === 1
                        ? "Ready to Book Your Date?"
                        : "Complete Payment"}
                    </h2>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <span className="text-xl">&times;</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {step === 1
                      ? "Let's plan your perfect day — together"
                      : "Pay the advance to secure your booking"}
                  </p>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                  {message.text && (
                    <div
                      className={`mb-4 p-3 rounded text-white text-sm text-center ${
                        message.type === "success"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {message.text}
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {step === 1 ? (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-4"
                      >
                        {/* Name */}
                        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <Input
                              name="firstName"
                              type="text"
                              placeholder="First Name"
                              value={formData.firstName}
                              onChange={handleChange}
                              className={`bg-[#fff] text-[#333] border-0 ${
                                errors.firstName ? "border-red-500" : ""
                              }`}
                            />
                            {errors.firstName && (
                              <span className="text-red-500 text-xs">
                                {errors.firstName}
                              </span>
                            )}
                          </div>
                          <div>
                            <Input
                              name="lastName"
                              type="text"
                              placeholder="Last Name"
                              value={formData.lastName}
                              onChange={handleChange}
                              className={`bg-[#fff] text-[#333] border-0 ${
                                errors.lastName ? "border-red-500" : ""
                              }`}
                            />
                            {errors.lastName && (
                              <span className="text-red-500 text-xs">
                                {errors.lastName}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Contact */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <Input
                              name="email"
                              type="email"
                              placeholder="Email (Optional)"
                              value={formData.email}
                              onChange={handleChange}
                              className={`bg-[#fff] text-[#333] border-0 ${
                                errors.email ? "border-red-500" : ""
                              }`}
                            />
                            {errors.email && (
                              <span className="text-red-500 text-xs">
                                {errors.email}
                              </span>
                            )}
                          </div>
                          <div>
                            <Input
                              name="mobileno"
                              type="tel"
                              placeholder="Phone Number"
                              value={formData.mobileno}
                              onChange={(e) => {
                                const val = e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 10);
                                setFormData((prev) => ({
                                  ...prev,
                                  mobileno: val,
                                }));
                                if (errors.mobileno)
                                  setErrors((prev) => ({
                                    ...prev,
                                    mobileno: null,
                                  }));
                              }}
                              className={`bg-[#fff] text-[#333] border-0 ${
                                errors.mobileno ? "border-red-500" : ""
                              }`}
                            />
                            {errors.mobileno && (
                              <span className="text-red-500 text-xs">
                                {errors.mobileno}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Property & Room */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <Select
                              name="propertyType"
                              selectedKeys={
                                formData.propertyType
                                  ? [formData.propertyType.toLowerCase()]
                                  : []
                              }
                              onChange={(e) => {
                                handleChange(e);
                                setFormData((prev) => ({
                                  ...prev,
                                  selectedRoom: "",
                                }));
                              }}
                              className={`bg-[#fff] text-[#333] border-0 ${
                                errors.propertyType ? "border-red-500" : ""
                              }`}
                              placeholder="Property Type"
                            >
                              {propertyTypes.map((type) => (
                                <SelectItem
                                  key={type.name.toLowerCase()}
                                  value={type.name.toLowerCase()}
                                >
                                  {type.name}
                                </SelectItem>
                              ))}
                            </Select>
                            {errors.propertyType && (
                              <span className="text-red-500 text-xs">
                                {errors.propertyType}
                              </span>
                            )}
                          </div>
                          <div>
                            <Select
                              name="selectedRoom"
                              selectedKeys={
                                formData.selectedRoom
                                  ? [formData.selectedRoom]
                                  : []
                              }
                              onChange={handleChange}
                              isDisabled={!formData.propertyType}
                              className={`bg-[#fff] text-[#333] border-0 ${
                                errors.selectedRoom ? "border-red-500" : ""
                              }`}
                              placeholder="Select Unit"
                            >
                              {filteredRooms.map((room) => (
                                <SelectItem key={room._id} value={room._id}>
                                  {`${room.name} (₹${room.price.toLocaleString()})`}
                                </SelectItem>
                              ))}
                            </Select>
                            {errors.selectedRoom && (
                              <span className="text-red-500 text-xs">
                                {errors.selectedRoom}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Event & Dates */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <Select
                              name="eventType"
                              selectedKeys={
                                formData.eventType
                                  ? [formData.eventType.toLowerCase()]
                                  : []
                              }
                              onChange={handleChange}
                              className={`bg-[#fff] text-[#333] border-0 ${
                                errors.eventType ? "border-red-500" : ""
                              }`}
                              placeholder="Event Type"
                            >
                              {eventTypes.map((type) => (
                                <SelectItem
                                  key={type.name.toLowerCase()}
                                  value={type.name.toLowerCase()}
                                >
                                  {type.name}
                                </SelectItem>
                              ))}
                            </Select>
                            {errors.eventType && (
                              <span className="text-red-500 text-xs">
                                {errors.eventType}
                              </span>
                            )}
                          </div>
                          <div>
                            <DateRangePicker
                              className={`bg-[#fff] text-[#333] border-0 ${
                                errors.eventDate ? "border-red-500" : ""
                              }`}
                              label="Event Duration"
                              onChange={(range) => {
                                if (range?.start && range?.end) {
                                  setFormData((prev) => ({
                                    ...prev,
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
                                    setErrors((prev) => ({
                                      ...prev,
                                      eventDate: null,
                                    }));
                                }
                              }}
                              calendarProps={{
                                classNames: {
                                  base: "bg-background",
                                  headerWrapper: "pt-4 bg-background",
                                  prevButton:
                                    "border-1 border-default-200 rounded-small",
                                  nextButton:
                                    "border-1 border-default-200 rounded-small",
                                  gridHeader:
                                    "bg-background shadow-none border-b-1 border-default-100",
                                  cellButton: [
                                    "data-[today=true]:bg-default-100",
                                    "data-[selected=true]:bg-transparent rounded-small",
                                  ],
                                },
                              }}
                            />
                            {errors.eventDate && (
                              <span className="text-red-500 text-xs">
                                {errors.eventDate}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Notes */}
                        <div>
                          <Textarea
                            name="notes"
                            placeholder="Tell us about your vision for the perfect day..."
                            value={formData.notes}
                            onChange={handleChange}
                            className="text-[#333] border-0 resize-none min-h-[80px]"
                          />
                        </div>

                        {/* Pay Advance Opt-in */}
                        {paymentSettings?.paymentMethod && (
                          <div
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              formData.intendsToPay
                                ? "border-hotel-primary bg-hotel-primary/5"
                                : "border-gray-200 hover:border-hotel-primary/50"
                            }`}
                            onClick={() =>
                              setFormData((p) => ({
                                ...p,
                                intendsToPay: !p.intendsToPay,
                              }))
                            }
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox
                                isSelected={formData.intendsToPay}
                                onValueChange={(v) =>
                                  setFormData((p) => ({
                                    ...p,
                                    intendsToPay: v,
                                  }))
                                }
                                color="primary"
                                size="sm"
                              />
                              <div>
                                <p className="font-semibold text-sm text-gray-800">
                                  Pay 50% Advance Now?
                                </p>
                                <p className="text-xs text-gray-500">
                                  Fast-track your booking confirmation
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Payment details preview when checked */}
                        {formData.intendsToPay && renderPaymentDetails()}

                        {/* Consent */}
                        <div>
                          <Checkbox
                            isSelected={formData.consentAccepted}
                            onValueChange={(v) => {
                              setFormData((p) => ({
                                ...p,
                                consentAccepted: v,
                              }));
                              if (errors.consentAccepted)
                                setErrors((p) => ({
                                  ...p,
                                  consentAccepted: null,
                                }));
                            }}
                            size="sm"
                          >
                            <span className="text-xs text-gray-500">
                              I agree to the{" "}
                              <a
                                href="/policies"
                                target="_blank"
                                className="text-hotel-primary font-bold underline"
                              >
                                Privacy & Terms
                              </a>{" "}
                              *
                            </span>
                          </Checkbox>
                          {errors.consentAccepted && (
                            <p className="text-red-500 text-xs mt-1">
                              You must accept to continue
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      /* ── Step 2: Payment Proof ── */
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-4"
                      >
                        <button
                          onClick={() => {
                            setStep(1);
                            setErrors({});
                          }}
                          className="text-hotel-primary text-sm flex items-center gap-1 hover:underline"
                        >
                          ← Back to details
                        </button>

                        {/* Amount badge */}
                        <div className="p-4 bg-hotel-primary/10 border border-dashed border-hotel-primary/30 rounded-lg text-center">
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                            Advance Payment (50%)
                          </p>
                          <p className="text-3xl font-bold text-hotel-primary">
                            ₹{calculateAdvance().toLocaleString()}
                          </p>
                        </div>

                        {/* Payment details — always visible */}
                        {renderPaymentDetails()}

                        {/* Payment proof */}
                        <div className="space-y-3">
                          <Input
                            name="paidAmount"
                            type="number"
                            placeholder="Amount Actually Paid (₹)"
                            value={formData.paidAmount}
                            onChange={handleChange}
                            className={`bg-[#fff] text-[#333] border-0 ${
                              errors.paidAmount ? "border-red-500" : ""
                            }`}
                          />
                          {errors.paidAmount && (
                            <span className="text-red-500 text-xs">
                              {errors.paidAmount}
                            </span>
                          )}

                          <div
                            className={`relative border-2 border-dashed rounded-lg p-5 text-center transition-all cursor-pointer ${
                              errors.paymentReceipt
                                ? "border-red-400 bg-red-50"
                                : formData.paymentReceipt
                                  ? "border-green-400 bg-green-50"
                                  : "border-gray-300 hover:border-hotel-primary bg-gray-50"
                            }`}
                          >
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleReceiptUpload}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="flex flex-col items-center gap-2">
                              <svg
                                className={`w-8 h-8 ${
                                  formData.paymentReceipt
                                    ? "text-green-500"
                                    : "text-gray-400"
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
                              <span
                                className={`text-sm font-medium ${
                                  formData.paymentReceipt
                                    ? "text-green-600"
                                    : "text-gray-600"
                                }`}
                              >
                                {formData.paymentReceipt
                                  ? `✓ ${formData.paymentReceipt.name}`
                                  : "Upload Payment Screenshot"}
                              </span>
                            </div>
                          </div>
                          {errors.paymentReceipt && (
                            <p className="text-red-500 text-xs text-center">
                              {errors.paymentReceipt}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="border-t p-3 sm:p-4 bg-white shrink-0">
                  <Button
                    onPress={step === 1 ? handleNext : submitBooking}
                    disabled={loading}
                    className="w-full bg-hotel-primary text-white py-2 sm:py-3 rounded-md text-sm sm:text-lg font-medium hover:bg-hotel-primary/90 transition-colors"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : step === 1 ? (
                      formData.intendsToPay ? (
                        "Continue to Payment"
                      ) : (
                        "Submit Booking Request"
                      )
                    ) : (
                      "Confirm & Submit"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
