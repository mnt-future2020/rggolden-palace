import { NextResponse } from "next/server";
import { getHotelDatabase } from "@/utils/config/hotelConnection";
import { getModel } from "@/utils/helpers/getModel";
import GuestInfo from "@/utils/model/contacts/guestInfoListSchema";
import { getUniqueGuestId } from "@/utils/helpers/guestIdGenerator";
import { uploadToCloudinary } from "@/utils/helpers/cloudinary";

export async function POST(request) {
  try {
    const formData = await request.formData();

    // Generate unique guest ID
    const guestId = await getUniqueGuestId({
      email: formData.get("email"),
      mobileNo: formData.get("countryCode") + formData.get("mobileNo"),
    });

    // Get basic guest data without uploadedFiles
    const guestData = {
      guestId,
      name: `${formData.get("firstName")} ${formData.get("lastName")}`,
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      mobileNo: formData.get("countryCode") + formData.get("mobileNo"),
      address: formData.get("address"),
      gender: formData.get("gender"),
      dateOfBirth: formData.get("dateOfBirth"),
      nationality: formData.get("nationality"),
      verificationType: formData.get("verificationType"),
      verificationId: formData.get("verificationId"),
      updatedAt: new Date(),
    };

    // Process files and upload to Cloudinary
    const newUploadedFiles = [];
    const files = formData.getAll("files");
    if (files?.length > 0) {
      for (const file of files) {
        if (!file.name) continue;

        const buffer = Buffer.from(await file.arrayBuffer());
        const { url } = await uploadToCloudinary(buffer, {
          folder: "wedding-mahaal/guests",
          fileName: file.name,
        });

        newUploadedFiles.push({
          fileName: file.name,
          fileType: file.type,
          fileUrl: url,
          uploadDate: new Date(),
        });
      }
    }

    // Save to database
    await getHotelDatabase();
    const GuestInfoModel = getModel("GuestInfo", GuestInfo);

    // Check if guest exists
    const existingGuest = await GuestInfoModel.findOne({ guestId });

    let guest;
    if (existingGuest) {
      // Update existing guest
      guest = await GuestInfoModel.findOneAndUpdate(
        { guestId },
        {
          $set: guestData,
          $push: {
            uploadedFiles: {
              $each: newUploadedFiles,
            },
          },
        },
        { new: true }
      );
    } else {
      // Create new guest
      guestData.createdAt = new Date();
      guestData.uploadedFiles = newUploadedFiles;
      guestData.totalVisits = 0;
      guestData.totalAmountSpent = 0;
      guestData.lastStayDate = null;
      guestData.stayHistory = [];

      guest = new GuestInfoModel(guestData);
      await guest.save();
    }

    return NextResponse.json({
      success: true,
      message: existingGuest
        ? "Guest updated successfully"
        : "Guest added successfully",
      guest,
    });
  } catch (error) {
    console.error("Error adding guest:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
