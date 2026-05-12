import { getHotelDatabase } from "../../../utils/config/hotelConnection";
import SuperAdminHotel from "../../../utils/model/SuperAdminHotel";
import { NextResponse } from "next/server";
import { saveFile } from "../../../utils/helpers/fileUpload";
import { getModel } from "../../../utils/helpers/getModel";
import nodemailer from "nodemailer";
import { getSMTPConfig } from "../../../utils/helpers/getSMTPConfig";
import crypto from "crypto";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Remove allowedMethods export and add method validation in handlers
async function validateMethod(request, allowedMethods) {
  if (!allowedMethods.includes(request.method)) {
    return NextResponse.json(
      { error: `Method ${request.method} Not Allowed` },
      { status: 405 }
    );
  }
  return null;
}

export async function GET(request) {
  const methodError = await validateMethod(request, ["GET"]);
  if (methodError) return methodError;

  try {
    const { hotelData } = await getHotelDatabase();

    // Will always have data since getHotelDatabase creates default if missing
    return NextResponse.json({ success: true, hotelData: hotelData });
  } catch (err) {
    console.error("Error fetching mahal data:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching mahal details",
        error: err.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const methodError = await validateMethod(request, ["PUT"]);
  if (methodError) return methodError;

  try {
    const updateData = await request.json();
    const { ...cleanUpdateData } = updateData;

    await getHotelDatabase();
    const HotelModel = getModel("Hotel", SuperAdminHotel);
    const oldHotel = await HotelModel.findOne();

    // Handle logo update
    if (cleanUpdateData.logo && cleanUpdateData.logo.startsWith("data:image")) {
      try {
        const newLogoPath = await saveFile(
          cleanUpdateData.logo,
          "hotel",
          oldHotel?.logo
        );
        cleanUpdateData.logo = newLogoPath;
      } catch (error) {
        console.error("Error handling logo:", error);
        throw new Error("Failed to process logo");
      }
    }

    // Handle email change verification
    if (cleanUpdateData.emailId && oldHotel && cleanUpdateData.emailId !== oldHotel.emailId) {
      try {
        // Store the pending email
        cleanUpdateData.pendingEmailId = cleanUpdateData.emailId;
        // Don't update emailId yet
        delete cleanUpdateData.emailId;

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(verificationToken).digest("hex");
        const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Store token in hotel document
        cleanUpdateData.emailVerificationToken = tokenHash;
        cleanUpdateData.emailVerificationExpiry = expiryTime;

        // Update hotel with pending email and token FIRST
        const updateResult = await HotelModel.findOneAndUpdate(
          {},
          cleanUpdateData,
          { new: true }
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

        const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email-change?token=${verificationToken}&email=${encodeURIComponent(cleanUpdateData.pendingEmailId)}`;

        const emailTemplate = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                :root {
                  --primary-color: #667eea;
                  --primary-dark: #5568d3;
                  --text-dark: #1a1a1a;
                  --text-gray: #555555;
                  --bg-light: #f8f9ff;
                  --border-color: #e0e0e0;
                }
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                  background-color: var(--bg-light);
                  line-height: 1.6;
                  color: var(--text-dark);
                }
                .wrapper { background-color: var(--bg-light); padding: 20px; }
                .container { 
                  max-width: 600px; 
                  margin: 0 auto; 
                  background-color: #ffffff;
                  border-radius: 12px;
                  overflow: hidden;
                  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
                }
                .header {
                  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
                  padding: 50px 30px;
                  text-align: center;
                  color: white;
                  border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                .header-icon {
                  font-size: 48px;
                  margin-bottom: 16px;
                }
                .hotel-name {
                  font-size: 26px;
                  font-weight: 700;
                  letter-spacing: -0.5px;
                  margin-bottom: 8px;
                }
                .header-subtitle {
                  font-size: 14px;
                  opacity: 0.95;
                  font-weight: 400;
                  letter-spacing: 0.3px;
                }
                .content {
                  padding: 45px 35px;
                }
                .greeting {
                  font-size: 18px;
                  font-weight: 700;
                  color: var(--text-dark);
                  margin-bottom: 24px;
                }
                .message {
                  font-size: 15px;
                  color: var(--text-gray);
                  margin-bottom: 18px;
                  line-height: 1.8;
                }
                .email-box {
                  background: linear-gradient(135deg, var(--bg-light) 0%, #f0f4ff 100%);
                  padding: 18px 20px;
                  border-left: 5px solid var(--primary-color);
                  margin: 28px 0;
                  border-radius: 8px;
                  font-size: 15px;
                  color: var(--text-dark);
                  font-weight: 500;
                }
                .email-label {
                  display: block;
                  font-size: 12px;
                  color: #999;
                  margin-bottom: 6px;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                }
                .button-wrapper {
                  text-align: center;
                  margin: 40px 0;
                }
                .button {
                  display: inline-block;
                  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
                  color: white;
                  padding: 16px 50px;
                  text-decoration: none;
                  border-radius: 8px;
                  font-weight: 700;
                  font-size: 16px;
                  transition: all 0.3s ease;
                  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.35);
                  letter-spacing: 0.3px;
                }
                .button:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 8px 28px rgba(102, 126, 234, 0.45);
                }
                .copy-link {
                  background-color: #f9f9f9;
                  padding: 14px 16px;
                  border-radius: 6px;
                  font-size: 12px;
                  color: #666;
                  word-break: break-all;
                  line-height: 1.6;
                  margin-top: 16px;
                  border: 1px solid var(--border-color);
                  font-family: 'Courier New', monospace;
                }
                .copy-link-label {
                  display: block;
                  font-size: 13px;
                  color: #999;
                  margin-bottom: 8px;
                  text-align: center;
                }
                .security-box {
                  background: linear-gradient(135deg, #fff9e6 0%, #fff3cc 100%);
                  border-left: 5px solid #ffc107;
                  padding: 16px 18px;
                  border-radius: 8px;
                  margin: 28px 0;
                  font-size: 14px;
                  color: #856404;
                  font-weight: 500;
                }
                .security-icon {
                  margin-right: 8px;
                  font-size: 16px;
                }
                .divider {
                  height: 1px;
                  background-color: var(--border-color);
                  margin: 28px 0;
                }
                .warning-section {
                  padding: 20px;
                  background-color: #fafbff;
                  border-radius: 8px;
                  border: 1px solid var(--border-color);
                  margin-top: 28px;
                }
                .warning-title {
                  font-size: 15px;
                  font-weight: 700;
                  color: var(--text-dark);
                  margin-bottom: 10px;
                }
                .warning-text {
                  font-size: 14px;
                  color: var(--text-gray);
                  line-height: 1.7;
                }
                .footer {
                  background-color: #fafbff;
                  padding: 30px 35px;
                  text-align: center;
                  border-top: 1px solid var(--border-color);
                  font-size: 13px;
                  color: #999;
                }
                .footer-links {
                  margin: 14px 0;
                }
                .footer-links a {
                  color: var(--primary-color);
                  text-decoration: none;
                  margin: 0 14px;
                  font-weight: 600;
                  font-size: 13px;
                }
                .footer-links a:hover {
                  text-decoration: underline;
                }
                .copyright {
                  margin-top: 14px;
                  font-size: 12px;
                  color: #bbb;
                }
                .footer-note {
                  font-size: 12px;
                  color: #999;
                  margin: 10px 0;
                  font-style: italic;
                }
              </style>
            </head>
            <body>
              <div class="wrapper">
                <div class="container">
                  <div class="header">
                    <div class="header-icon">✉️</div>
                    <div class="hotel-name">${oldHotel?.hotelName || 'Mahal'}</div>
                    <div class="header-subtitle">Email Verification</div>
                  </div>
                  
                  <div class="content">
                    <div class="greeting">Hello Admin,</div>
                    
                    <p class="message">
                      You have requested to update the email address associated with your account. To complete this change and maintain account security, please verify your new email address by clicking the button below.
                    </p>
                    
                    <div class="email-box">
                      <span class="email-label">New Email Address</span>
                      ${cleanUpdateData.pendingEmailId}
                    </div>
                    
                    <div class="button-wrapper">
                      <a href="${verificationLink}" class="button">Verify Email Address</a>
                    </div>
                    
                    <div class="copy-link-label">Or copy and paste this link:</div>
                    <div class="copy-link">
                      ${verificationLink}
                    </div>
                    
                    <div class="security-box">
                      <span class="security-icon">⏰</span>
                      <strong>This link expires in 24 hours</strong> for security purposes.
                    </div>
                    
                    <div class="warning-section">
                      <div class="warning-title">Didn't request this change?</div>
                      <div class="warning-text">
                        If you did not request this email change, please ignore this message. Your account remains secure with your current email address. Contact our support team if you believe your account has been compromised.
                      </div>
                    </div>
                  </div>
                  
                  <div class="footer">
                    <div class="footer-note">This is an automated security message. Please do not reply to this email.</div>
                    <div class="footer-links">
                      <a href="${process.env.NEXTAUTH_URL}/dashboard">Dashboard</a> | 
                      <a href="${process.env.NEXTAUTH_URL}/contact">Support</a>
                    </div>
                    <div class="copyright">
                      © ${new Date().getFullYear()} ${oldHotel?.hotelName || 'Mahal'}. All rights reserved.
                    </div>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `;

        await transporter.sendMail({
          from: smtpConfig.from,
          to: cleanUpdateData.pendingEmailId,
          subject: "Verify Your Email Address Change",
          html: emailTemplate,
        });

        return NextResponse.json({
          success: true,
          message: "Verification email sent to your new email address. Please verify to complete the email change.",
          requiresEmailVerification: true,
        });
      } catch (emailError) {
        console.error("Error in email verification flow:", {
          message: emailError.message,
          code: emailError.code,
          stack: emailError.stack
        });
        return NextResponse.json(
          {
            success: false,
            message: "Failed to send verification email",
            error: emailError.message,
          },
          { status: 500 }
        );
      }
    }

    // Update hotel details normally if no email change
    const updatedHotel = await HotelModel.findOneAndUpdate(
      {}, // Empty filter to update first document
      cleanUpdateData,
      { new: true, upsert: true }
    );

    if (!updatedHotel) {
      throw new Error("Failed to update mahal data");
    }

    return NextResponse.json({
      success: true,
      message: "Mahal details updated successfully",
      hotelData: updatedHotel,
    });
  } catch (err) {
    console.error("Error updating mahal data:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Error updating mahal details",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
