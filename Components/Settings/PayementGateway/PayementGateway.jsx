"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button } from "@heroui/button";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const PAYMENT_METHODS = [
  { value: "upiQrCode", label: "UPI QR Code Image", icon: "📱" },
  { value: "upiId", label: "UPI ID (VPA)", icon: "💳" },
  { value: "bankDetails", label: "Bank Transfer (NEFT/IMPS)", icon: "🏦" },
];

export default function RazorPayConfig() {
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [upiId, setUpiId] = useState("");
  const [upiQrCode, setUpiQrCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankBranch, setBankBranch] = useState("");

  const [initialApiKey, setInitialApiKey] = useState("");
  const [initialSecretKey, setInitialSecretKey] = useState("");
  const [initialUpiId, setInitialUpiId] = useState("");
  const [initialUpiQrCode, setInitialUpiQrCode] = useState("");
  const [initialPaymentMethod, setInitialPaymentMethod] = useState("");
  const [initialAccountHolderName, setInitialAccountHolderName] = useState("");
  const [initialAccountNumber, setInitialAccountNumber] = useState("");
  const [initialIfscCode, setInitialIfscCode] = useState("");
  const [initialBankBranch, setInitialBankBranch] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState("");
  const [upiQrCodeFile, setUpiQrCodeFile] = useState(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setIsLoading(true);
    setAction("Fetching");
    try {
      const { data } = await axios.get(`/api/settings/payementGateway`);
      setApiKey(data.apiKey);
      setSecretKey(data.secretKey);
      setUpiId(data.upiId || "");
      setUpiQrCode(data.upiQrCode || "");
      setPaymentMethod(data.paymentMethod || "");
      setAccountHolderName(data.accountHolderName || "");
      setAccountNumber(data.accountNumber || "");
      setIfscCode(data.ifscCode || "");
      setBankBranch(data.bankBranch || "");

      setInitialApiKey(data.apiKey);
      setInitialSecretKey(data.secretKey);
      setInitialUpiId(data.upiId || "");
      setInitialUpiQrCode(data.upiQrCode || "");
      setInitialPaymentMethod(data.paymentMethod || "");
      setInitialAccountHolderName(data.accountHolderName || "");
      setInitialAccountNumber(data.accountNumber || "");
      setInitialIfscCode(data.ifscCode || "");
      setInitialBankBranch(data.bankBranch || "");
    } catch (error) {
      console.error("Error fetching config:", error);
      toast.error(
        error.response?.data?.error || "Failed to fetch configuration",
      );
    } finally {
      setIsLoading(false);
      setAction("");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpiQrCodeFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setUpiQrCode(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    // Validate Razorpay ONLY if keys are provided
    if (apiKey && secretKey) {
      if (!apiKey.startsWith("rzp_") || apiKey.length < 20) {
        toast.error("Invalid Razorpay API key format");
        return;
      }
    }

    // Client-side validation for the selected payment method
    if (paymentMethod === "upiQrCode" && !upiQrCode && !upiQrCodeFile) {
      toast.error("Please upload a UPI QR Code image");
      return;
    }
    if (paymentMethod === "upiId" && !upiId) {
      toast.error("Please enter your UPI ID");
      return;
    }
    if (paymentMethod === "bankDetails") {
      if (!accountHolderName || !accountNumber || !ifscCode) {
        toast.error("Please fill in all bank detail fields");
        return;
      }
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(ifscCode)) {
        toast.error("Invalid IFSC code format (e.g. SBIN0001234)");
        return;
      }
    }

    setIsLoading(true);
    setAction("Saving");

    try {
      const formData = new FormData();
      formData.append("apiKey", apiKey);
      formData.append("secretKey", secretKey);
      formData.append("upiId", upiId);
      formData.append("paymentMethod", paymentMethod);
      formData.append("accountHolderName", accountHolderName);
      formData.append("accountNumber", accountNumber);
      formData.append("ifscCode", ifscCode);
      formData.append("bankBranch", bankBranch);
      if (upiQrCodeFile) {
        formData.append("upiQrCode", upiQrCodeFile);
      }

      const { data } = await axios.post(
        `/api/settings/payementGateway`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      setUpiQrCodeFile(null);
      fetchConfig(); // Re-fetch to get clean URLs
      toast.success(data.message);
    } catch (error) {
      console.error("Error saving configuration:", error);
      toast.error(
        error.response?.data?.message || "Failed to update configuration",
      );
    } finally {
      setIsLoading(false);
      setAction("");
    }
  };

  const isSaveEnabled =
    apiKey !== initialApiKey ||
    secretKey !== initialSecretKey ||
    upiId !== initialUpiId ||
    upiQrCodeFile ||
    paymentMethod !== initialPaymentMethod ||
    accountHolderName !== initialAccountHolderName ||
    accountNumber !== initialAccountNumber ||
    ifscCode !== initialIfscCode ||
    bankBranch !== initialBankBranch;

  return (
    <section className="mx-auto space-y-8 bg-white rounded-lg p-8 shadow-sm min-h-[811px]">
      <div className="p-3">
        <h3 className="text-3xl font-bold mb-6">Payment Configuration</h3>
        <form>
          {/* ── Razorpay Section ── */}
          <div className="row mb-4">
            <h4 className="text-xl font-semibold mb-3">Razorpay</h4>
            <div className="col-md-6 mb-3 mb-md-0">
              <label htmlFor="apiKey" className="form-label font-semibold">
                Razor Api Key
              </label>
              <input
                type="text"
                className="form-control bg-white"
                id="apiKey"
                placeholder="Razor Pay Api Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="secretKey" className="form-label font-semibold">
                Razorpay Secret Key
              </label>
              <input
                type="text"
                className="form-control bg-white"
                id="secretKey"
                placeholder="Razor Pay Secret Key"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <hr className="my-4" />

          {/* ── Payment Method Selection ── */}
          <div className="mb-4">
            <h4 className="text-xl font-semibold mb-2">
              Manual Payment Method
            </h4>
            <p className="text-sm text-gray-500 mb-4">
              Choose which payment option to display on public booking pages.
              Only the selected method will be visible to customers.
            </p>

            <div className="row g-3 mb-4">
              {PAYMENT_METHODS.map((method) => (
                <div key={method.value} className="col-md-4">
                  <div
                    onClick={() => !isLoading && setPaymentMethod(method.value)}
                    className={`p-3 rounded-3 border-2 cursor-pointer transition-all text-center ${
                      paymentMethod === method.value
                        ? "border-primary bg-primary bg-opacity-10 shadow-sm"
                        : "border-light bg-white hover:shadow-sm"
                    }`}
                    style={{
                      borderColor:
                        paymentMethod === method.value ? "#0d6efd" : "#dee2e6",
                      backgroundColor:
                        paymentMethod === method.value
                          ? "rgba(13, 110, 253, 0.05)"
                          : "#fff",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div className="fs-3 mb-1">{method.icon}</div>
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        className="form-check-input mt-0"
                        checked={paymentMethod === method.value}
                        onChange={() => setPaymentMethod(method.value)}
                        disabled={isLoading}
                      />
                      <label className="form-check-label fw-semibold small">
                        {method.label}
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── UPI QR Code Fields ── */}
            {paymentMethod === "upiQrCode" && (
              <div className="row mb-4 p-3 border rounded-3 bg-light animate__animated animate__fadeIn">
                <h5 className="fw-semibold mb-3 text-secondary">
                  📱 UPI QR Code Settings
                </h5>
                <div className="col-12">
                  <label
                    htmlFor="upiQrCode"
                    className="form-label font-semibold"
                  >
                    Upload QR Code Image
                  </label>
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      className="form-control bg-white"
                      id="upiQrCode"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={isLoading}
                    />
                    {upiQrCode && (
                      <div className="mt-2 text-center border p-2 rounded">
                        <p className="text-sm text-gray-500 mb-1">Preview:</p>
                        <img
                          src={upiQrCode}
                          alt="UPI QR Code"
                          className="max-h-48 max-w-full object-contain mx-auto"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── UPI ID Fields ── */}
            {paymentMethod === "upiId" && (
              <div className="row mb-4 p-3 border rounded-3 bg-light animate__animated animate__fadeIn">
                <h5 className="fw-semibold mb-3 text-secondary">
                  💳 UPI ID Settings
                </h5>
                <div className="col-md-6">
                  <label htmlFor="upiId" className="form-label font-semibold">
                    UPI ID (VPA)
                  </label>
                  <input
                    type="text"
                    className="form-control bg-white"
                    id="upiId"
                    placeholder="e.g. name@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    disabled={isLoading}
                  />
                  <small className="text-muted">
                    Your Virtual Payment Address (e.g. business@paytm, shop@ybl)
                  </small>
                </div>
              </div>
            )}

            {/* ── Bank Details Fields ── */}
            {paymentMethod === "bankDetails" && (
              <div className="row mb-4 p-3 border rounded-3 bg-light animate__animated animate__fadeIn">
                <h5 className="fw-semibold mb-3 text-secondary">
                  🏦 Bank Account Details
                </h5>
                <div className="col-md-6 mb-3">
                  <label
                    htmlFor="accountHolderName"
                    className="form-label font-semibold"
                  >
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    className="form-control bg-white"
                    id="accountHolderName"
                    placeholder="e.g. RGV Mahal Pvt Ltd"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label
                    htmlFor="accountNumber"
                    className="form-label font-semibold"
                  >
                    Account Number
                  </label>
                  <input
                    type="text"
                    className="form-control bg-white"
                    id="accountNumber"
                    placeholder="e.g. 1234567890123456"
                    value={accountNumber}
                    onChange={(e) =>
                      setAccountNumber(e.target.value.replace(/\D/g, ""))
                    }
                    disabled={isLoading}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label
                    htmlFor="ifscCode"
                    className="form-label font-semibold"
                  >
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    className="form-control bg-white"
                    id="ifscCode"
                    placeholder="e.g. SBIN0001234"
                    value={ifscCode}
                    onChange={(e) =>
                      setIfscCode(e.target.value.toUpperCase().slice(0, 11))
                    }
                    disabled={isLoading}
                    maxLength={11}
                  />
                  <small className="text-muted">
                    11-character Indian Financial System Code
                  </small>
                </div>
                <div className="col-md-6 mb-3">
                  <label
                    htmlFor="bankBranch"
                    className="form-label font-semibold"
                  >
                    Bank Branch / Location
                  </label>
                  <input
                    type="text"
                    className="form-control bg-white"
                    id="bankBranch"
                    placeholder="e.g. Anna Nagar, Chennai"
                    value={bankBranch}
                    onChange={(e) => setBankBranch(e.target.value)}
                    disabled={isLoading}
                  />
                  <small className="text-muted">
                    City or area where the bank branch is located
                  </small>
                </div>
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end">
            <Button
              type="button"
              radius="full"
              className={`bg-hotel-primary text-white w-[150px] ${
                isSaveEnabled
                  ? "bg-hotel-primary hover:bg-hotel-primary"
                  : "disabled"
              }`}
              onClick={action === "" ? handleSave : null}
              disabled={isLoading || (!isSaveEnabled && action === "")}
            >
              {isLoading ? `${action}...` : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
