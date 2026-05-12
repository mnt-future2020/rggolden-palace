import { NextResponse } from "next/server";
import { getHotelDatabase } from "../../../utils/config/hotelConnection";
import SuperAdminHotel from "../../../utils/model/SuperAdminHotel";
import { getModel } from "../../../utils/helpers/getModel";
import User from "../../../utils/model/nextauth/user.model";
import crypto from "crypto";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      return NextResponse.json(
        { success: false, message: "Missing token or email" },
        { status: 400 }
      );
    }

    await getHotelDatabase();
    const HotelModel = getModel("Hotel", SuperAdminHotel);

    // Hash the token to compare
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Find hotel with matching token
    const hotel = await HotelModel.findOne({
      emailVerificationToken: tokenHash,
      emailVerificationExpiry: { $gt: new Date() },
      pendingEmailId: email,
    });

    if (!hotel) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired verification link",
        },
        { status: 400 }
      );
    }

    // Update the hotel with verified email
    const updatedHotel = await HotelModel.findOneAndUpdate(
      { _id: hotel._id },
      {
        emailId: email,
        pendingEmailId: null,
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpiry: null,
      },
      { new: true }
    );

    // Also update the User model email if it exists
    try {
      const UserModel =
        mongoose.models.User || mongoose.model("User", User.schema || User);

      await UserModel.findOneAndUpdate(
        { email: hotel.emailId }, // Find by old email
        { email: email }, // Update to new email
        { new: true }
      );
    } catch (userUpdateError) {
      console.log("Note: User model email update skipped (may not exist yet)");
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message:
          "Email verified successfully. You can now login with your new email.",
        hotelData: updatedHotel,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error verifying email",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
