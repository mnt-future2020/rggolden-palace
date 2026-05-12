import { NextResponse } from "next/server";
import { getHotelDatabase } from "../../../utils/config/hotelConnection";
import { getModel } from "../../../utils/helpers/getModel";
import Crm from "../../../utils/model/Crm/CrmSchema";
import { uploadToCloudinary } from "../../../utils/helpers/cloudinary";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await getHotelDatabase();
    const CrmModel = getModel("Crm", Crm);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "pending"; // pending or moved

    const query =
      status === "moved" ? { movedToBooking: true } : { movedToBooking: false };

    const contacts = await CrmModel.find(query).sort({
      createdAt: -1,
    });

    return NextResponse.json(
      {
        success: true,
        contacts,
        message: "Contacts retrieved successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    await getHotelDatabase();
    const CrmModel = getModel("Crm", Crm);

    let firstName,
      lastName,
      email,
      mobileno,
      propertyType,
      eventType,
      eventStartDate,
      eventEndDate,
      notes,
      paidAmount,
      selectedRoom,
      consentAccepted,
      consentTimestamp;
    let finalReceiptPath = "";

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      firstName = formData.get("firstName");
      lastName = formData.get("lastName");
      email = formData.get("email");
      mobileno = formData.get("mobileno");
      propertyType = formData.get("propertyType");
      eventType = formData.get("eventType");
      eventStartDate = formData.get("eventStartDate");
      eventEndDate = formData.get("eventEndDate");
      notes = formData.get("notes");
      paidAmount = formData.get("paidAmount");
      selectedRoom = formData.get("selectedRoom");
      consentAccepted = formData.get("consentAccepted") === "true";
      consentTimestamp = formData.get("consentTimestamp");

      const receiptFile = formData.get("paymentReceipt");
      if (receiptFile && receiptFile.size > 0) {
        const buffer = Buffer.from(await receiptFile.arrayBuffer());
        const { url } = await uploadToCloudinary(buffer, {
          folder: "wedding-mahaal/receipts",
          fileName: receiptFile.name,
        });
        finalReceiptPath = url;
      }
    } else {
      const body = await request.json();
      ({
        firstName,
        lastName,
        email,
        mobileno,
        propertyType,
        eventType,
        eventStartDate,
        eventEndDate,
        notes,
        paidAmount,
        selectedRoom,
        consentAccepted,
        consentTimestamp,
      } = body);
      // For JSON (Dashboard), we assume consent if not provided or set to true
      if (consentAccepted === undefined) consentAccepted = true;
    }

    // Validation
    if (
      !firstName ||
      !lastName ||
      !mobileno ||
      !propertyType ||
      !eventType ||
      !eventStartDate ||
      !eventEndDate
    ) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 },
      );
    }

    // Strict consent check for public forms (which use FormData usually)
    if (contentType.includes("multipart/form-data") && !consentAccepted) {
      return NextResponse.json(
        {
          success: false,
          message: "You must accept the privacy policy and terms",
        },
        { status: 400 },
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 },
      );
    }

    const contact = await CrmModel.create({
      firstName,
      lastName,
      email,
      mobileno,
      propertyType,
      eventType,
      eventStartDate,
      eventEndDate,
      notes,
      paymentReceipt: finalReceiptPath,
      paidAmount: paidAmount ? parseFloat(paidAmount) : 0,
      selectedRoom: selectedRoom || null,
      consentAccepted: !!consentAccepted,
      consentTimestamp: consentTimestamp
        ? new Date(consentTimestamp)
        : new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        contact,
        message: "Contact created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  try {
    await getHotelDatabase();
    const CrmModel = getModel("Crm", Crm);

    const body = await request.json();
    const { contactId } = body;

    if (!contactId) {
      return NextResponse.json(
        {
          success: false,
          message: "Contact ID is required",
        },
        { status: 400 },
      );
    }

    const contact = await CrmModel.findByIdAndUpdate(
      contactId,
      { movedToBooking: true },
      { new: true },
    );

    if (!contact) {
      return NextResponse.json(
        {
          success: false,
          message: "Contact not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        contact,
        message: "Contact marked as moved to booking",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
