"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";

export default function VerifyEmailChangePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      const email = searchParams.get("email");

      if (!token || !email) {
        setStatus("error");
        setMessage("Invalid verification link");
        return;
      }

      try {
        const response = await fetch(
          `/api/verify-email-change?token=${token}&email=${encodeURIComponent(
            email
          )}`
        );
        const data = await response.json();

        if (data.success) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");

          router.push("/dashboard");
        } else {
          setStatus("error");
          setMessage(data.message || "Failed to verify email");
        }
      } catch (error) {
        setStatus("error");
        setMessage("Error verifying email: " + error.message);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center gap-3 p-6">
          <h1 className="text-2xl font-bold">Email Verification</h1>
        </CardHeader>
        <CardBody className="gap-4">
          {status === "verifying" && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Verifying your email...</p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">
                Email Verified!
              </h2>
              <p className="text-green-600 font-semibold mb-4">{message}</p>
              <p className="text-gray-600 mb-6">
                Redirecting to dashboard in a few seconds...
              </p>
              <Button
                color="success"
                onPress={() => router.push("/dashboard")}
                className="w-full font-semibold"
              >
                Go to Dashboard
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-4">✕</div>
              <p className="text-red-600 font-semibold mb-4">{message}</p>
              <p className="text-gray-600 mb-4">
                The verification link may have expired or is invalid.
              </p>
              <Button
                color="primary"
                onPress={() => router.push("/login")}
                className="w-full"
              >
                Go to Login
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
