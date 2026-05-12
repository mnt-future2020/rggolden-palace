import { NextResponse } from "next/server";
import { getHotelDatabase } from "../../../../utils/config/hotelConnection";
import { connectRazorpay } from "../../../../utils/config/connectRazorpay";
import ApiKeySchema from "../../../../utils/model/payementGateway/ApiKeySchema";
import { getModel } from "../../../../utils/helpers/getModel";
import { uploadToCloudinary } from "../../../../utils/helpers/cloudinary";

export async function GET() {
  try {
    await getHotelDatabase();
    const ApiKeys = getModel("ApiKeys", ApiKeySchema);
    const keys = await ApiKeys.findOne().maxTimeMS(5000);

    let apiKey = keys?.apiKey || process.env.NEXT_PUBLIC_RAZORPAY_API_KEY || "";
    let secretKey = keys?.secretKey || process.env.RAZORPAY_SECRET_KEY || "";
    let upiId = keys?.upiId || "";
    let upiQrCode = keys?.upiQrCode || "";
    let paymentMethod = keys?.paymentMethod || "";
    let accountHolderName = keys?.accountHolderName || "";
    let accountNumber = keys?.accountNumber || "";
    let ifscCode = keys?.ifscCode || "";
    let bankBranch = keys?.bankBranch || "";

    return NextResponse.json({
      apiKey,
      secretKey,
      upiId,
      upiQrCode,
      paymentMethod,
      accountHolderName,
      accountNumber,
      ifscCode,
      bankBranch,
    });
  } catch (error) {
    console.error("Error reading Razorpay keys:", error);
    return NextResponse.json(
      { error: "Failed to retrieve Razorpay keys" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const apiKey = formData.get("apiKey");
    const secretKey = formData.get("secretKey");
    const upiId = formData.get("upiId");
    const upiQrCodeFile = formData.get("upiQrCode");
    const paymentMethod = formData.get("paymentMethod") || "";
    const accountHolderName = formData.get("accountHolderName") || "";
    const accountNumber = formData.get("accountNumber") || "";
    const ifscCode = formData.get("ifscCode") || "";
    const bankBranch = formData.get("bankBranch") || "";

    // Only validate Razorpay if keys are provided
    if (apiKey && secretKey) {
      if (!apiKey.startsWith("rzp_") || apiKey.length < 20) {
        return NextResponse.json(
          { success: false, message: "Invalid Razorpay API key format" },
          { status: 400 },
        );
      }

      // Test connection with new keys before saving
      try {
        await connectRazorpay(apiKey, secretKey);
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid Razorpay configuration: ${error.message}`,
          },
          { status: 400 },
        );
      }
    }

    // Validate bank details if bankDetails method is selected
    if (paymentMethod === "bankDetails") {
      if (!accountHolderName || !accountNumber || !ifscCode) {
        return NextResponse.json(
          { success: false, message: "All bank details fields are required" },
          { status: 400 },
        );
      }
      // Basic IFSC validation
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.toUpperCase())) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid IFSC code format (e.g. SBIN0001234)",
          },
          { status: 400 },
        );
      }
    }

    // Validate UPI ID if upiId method is selected
    if (paymentMethod === "upiId" && !upiId) {
      return NextResponse.json(
        { success: false, message: "UPI ID is required" },
        { status: 400 },
      );
    }

    await getHotelDatabase();
    const ApiKeys = getModel("ApiKeys", ApiKeySchema);
    const existingKeys = await ApiKeys.findOne();

    // Handle QR Code file upload
    let finalQrCodePath = existingKeys?.upiQrCode || "";

    // Check if new file is uploaded (size > 0)
    if (
      upiQrCodeFile &&
      upiQrCodeFile instanceof File &&
      upiQrCodeFile.size > 0
    ) {
      const buffer = Buffer.from(await upiQrCodeFile.arrayBuffer());
      const { url } = await uploadToCloudinary(buffer, {
        folder: "wedding-mahaal/settings/payment",
        fileName: upiQrCodeFile.name,
      });
      finalQrCodePath = url;
    }

    // Validate that QR code exists if upiQrCode method is selected
    if (paymentMethod === "upiQrCode" && !finalQrCodePath) {
      return NextResponse.json(
        { success: false, message: "UPI QR Code image is required" },
        { status: 400 },
      );
    }

    await ApiKeys.findOneAndUpdate(
      {},
      {
        apiKey: apiKey || "",
        secretKey: secretKey || "",
        upiId: upiId || "",
        upiQrCode: finalQrCodePath,
        paymentMethod,
        accountHolderName,
        accountNumber,
        ifscCode: ifscCode ? ifscCode.toUpperCase() : "",
        bankBranch,
      },
      { upsert: true, new: true, runValidators: true },
    );

    return NextResponse.json({
      success: true,
      message: "Payment configuration updated successfully",
    });
  } catch (error) {
    console.error("Error updating Payment Gateway keys:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update configuration",
      },
      { status: 500 },
    );
  }
}
