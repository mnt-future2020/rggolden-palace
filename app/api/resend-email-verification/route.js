import { NextResponse } from "next/server";
import { getHotelDatabase } from "../../../utils/config/hotelConnection";
import SuperAdminHotel from "../../../utils/model/SuperAdminHotel";
import { getModel } from "../../../utils/helpers/getModel";
import nodemailer from "nodemailer";
import { getSMTPConfig } from "../../../utils/helpers/getSMTPConfig";
import crypto from "crypto";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * POST /api/resend-email-verification
 * Resends the email verification for pending email change
 */
export async function POST(request) {
  try {
    await getHotelDatabase();
    const HotelModel = getModel("Hotel", SuperAdminHotel);

    const hotel = await HotelModel.findOne();

    if (!hotel) {
      return NextResponse.json(
        { success: false, message: "Hotel not found" },
        { status: 404 }
      );
    }

    if (!hotel.pendingEmailId) {
      return NextResponse.json(
        { success: false, message: "No pending email change found" },
        { status: 400 }
      );
    }

    // Check if previous token is still valid
    if (
      hotel.emailVerificationExpiry &&
      hotel.emailVerificationExpiry > new Date()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Verification email was recently sent. Please check your inbox.",
        },
        { status: 400 }
      );
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update hotel with new token and expiry FIRST
    await HotelModel.findOneAndUpdate(
      {},
      {
        emailVerificationToken: tokenHash,
        emailVerificationExpiry: expiryTime,
      }
    );

    // Get SMTP config (fallback to .env)
    const smtpConfig = await getSMTPConfig();

    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: {
        user: smtpConfig.auth.user,
        pass: smtpConfig.auth.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const verificationLink = `${
      process.env.NEXTAUTH_URL
    }/verify-email-change?token=${verificationToken}&email=${encodeURIComponent(
      hotel.pendingEmailId
    )}`;

    const emailTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f0f0f0; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .button { background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
            .footer { text-align: center; color: #888; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Email Verification Required</h1>
            </div>
            <div class="content">
              <p>You have requested to change your email address to: <strong>${hotel.pendingEmailId}</strong></p>
              <p>Please click the button below to verify your new email address:</p>
              <a href="${verificationLink}" class="button">Verify Email Address</a>
              <p>This link will expire in 24 hours.</p>
              <p>If you didn't request this change, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: smtpConfig.from,
      to: hotel.pendingEmailId,
      subject: "Verify Your Email Address Change",
      html: emailTemplate,
    });

    return NextResponse.json({
      success: true,
      message: `Verification email resent to ${hotel.pendingEmailId}`,
    });
  } catch (error) {
    console.error("Error resending verification email:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to resend verification email",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
