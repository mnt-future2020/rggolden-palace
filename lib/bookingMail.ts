import nodemailer from "nodemailer";
import Handlebars from "handlebars";
import { bookingConfirmationTemplate } from "./templates/bookingConfirmationTemplate";
import { getHotelDatabase } from "../utils/config/hotelConnection";
import { generateBookingPDF } from "../lib/pdfGenerator";
import { bookingCancellationTemplate } from "./templates/bookingCancellationTemplate";
import { getSMTPConfig, type SMTPConfig } from "../utils/helpers/getSMTPConfig";

// Register Handlebars helper for equality comparison
Handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});

export async function sendBookingConfirmationEmail({
  to,
  name,
  bookingDetails,
}: {
  to: string;
  name: string;
  bookingDetails: {
    bookingNumber: string;
    firstName: string;
    checkIn: string;
    checkOut: string;
    numberOfRooms?: number;
    numberOfGuests?: number;
    roomTypes?: string;
    roomNumbers?: string;
    propertyType?: string;
    eventType?: string;
    timeSlot?: {
      name: string;
      fromTime: string;
      toTime: string;
    };
    groomDetails?: {
      name: string;
    };
    brideDetails?: {
      name: string;
    };
    selectedServices?: Array<{
      name: string;
    }>;
    hotelName: string;
    hotelDisplayName: string;
    hotelWebsite?: string;
    hotelAddress: string;
    hotelPhone: string;
    hotelEmail: string;
    totalAmount: number;
    discountPercentage?: number;
    discountAmount?: number;
  };
}) {
  try {
    const { hotelData: _hotelData } = await getHotelDatabase();
    const smtpConfig: SMTPConfig = await getSMTPConfig();

    const cleanHotelName = bookingDetails.hotelName
      .split("-")
      .slice(0, -1)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const formattedAmount = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(bookingDetails.totalAmount);

    const transport = nodemailer.createTransport(smtpConfig);

    if (
      bookingDetails.checkIn &&
      new Date(bookingDetails.checkIn).toString() !== "Invalid Date"
    ) {
      bookingDetails.checkIn = new Date(
        bookingDetails.checkIn
      ).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    if (
      bookingDetails.checkOut &&
      new Date(bookingDetails.checkOut).toString() !== "Invalid Date"
    ) {
      bookingDetails.checkOut = new Date(
        bookingDetails.checkOut
      ).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    const compiledTemplate = Handlebars.compile(bookingConfirmationTemplate);
    const htmlBody = compiledTemplate({
      ...bookingDetails,
      hotelDisplayName: bookingDetails.hotelDisplayName || cleanHotelName,
      totalAmount: formattedAmount,
      name,
      currentYear: new Date().getFullYear(),
    });

    await transport.verify();

    const pdfBuffer = await generateBookingPDF({
      ...bookingDetails,
      hotelDisplayName: bookingDetails.hotelDisplayName || cleanHotelName,
      totalAmount: bookingDetails.totalAmount,
    });

    const sendResult = await transport.sendMail({
      from: {
        name: bookingDetails.hotelDisplayName || cleanHotelName,
        address: smtpConfig.from,
      },
      to,
      subject: `Booking Confirmation - ${
        bookingDetails.hotelDisplayName || cleanHotelName
      } - #${bookingDetails.bookingNumber}`,
      html: htmlBody,
      attachments: [
        {
          filename: `booking-confirmation-${bookingDetails.bookingNumber}.pdf`,
          content: pdfBuffer as Buffer,
          contentType: "application/pdf",
        },
      ],
    });

    console.log("Email sent successfully with PDF attachment:", sendResult);
    return true;
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
    return false;
  }
}

export async function sendBookingCancellationEmail({
  to,
  bookingDetails,
}: {
  to: string;
  bookingDetails: {
    bookingNumber: string;
    firstName: string;
    checkIn: string;
    checkOut: string;
    propertyType?: string;
    eventType?: string;
    timeSlot?: {
      name: string;
      fromTime: string;
      toTime: string;
    };
    numberOfRooms?: number;
    roomTypes?: string;
    hotelName: string;
    hotelDisplayName: string;
    hotelAddress?: string;
    hotelPhone?: string;
    hotelEmail?: string;
  };
}) {
  try {
    const { hotelData: _hotelData } = await getHotelDatabase();
    const smtpConfig: SMTPConfig = await getSMTPConfig();

    const cleanHotelName = bookingDetails.hotelName
      .split("-")
      .slice(0, -1)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const compiledTemplate = Handlebars.compile(bookingCancellationTemplate);
    const htmlBody = compiledTemplate({
      ...bookingDetails,
      hotelDisplayName: bookingDetails.hotelDisplayName || cleanHotelName,
    });

    const transport = nodemailer.createTransport(smtpConfig);

    await transport.sendMail({
      from: {
        name: bookingDetails.hotelDisplayName || cleanHotelName,
        address: smtpConfig.from,
      },
      to,
      subject: `Booking Cancellation - ${
        bookingDetails.hotelDisplayName || cleanHotelName
      } - #${bookingDetails.bookingNumber}`,
      html: htmlBody,
    });

    return true;
  } catch (error) {
    console.error("Error sending cancellation email:", error);
    return false;
  }
}

export async function sendBookingNotificationToAdmin({
  adminEmail,
  bookingDetails,
}: {
  adminEmail: string;
  bookingDetails: {
    bookingNumber: string;
    firstName: string;
    lastName?: string;
    email: string;
    mobileNo: string;
    checkIn: string;
    checkOut: string;
    numberOfRooms?: number;
    numberOfGuests?: number;
    roomTypes?: string;
    roomNumbers?: string;
    propertyType?: string;
    eventType?: string;
    timeSlot?: {
      name: string;
      fromTime: string;
      toTime: string;
    };
    groomDetails?: {
      name: string;
    };
    brideDetails?: {
      name: string;
    };
    selectedServices?: Array<{
      name: string;
      price: number;
    }>;
    hotelName: string;
    totalAmount: number;
    discountAmount?: number;
  };
}) {
  try {
    const smtpConfig: SMTPConfig = await getSMTPConfig();
    const transport = nodemailer.createTransport(smtpConfig);

    // Format dates
    const checkInDate = new Date(bookingDetails.checkIn).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    const checkOutDate = new Date(bookingDetails.checkOut).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    const formattedAmount = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(bookingDetails.totalAmount);

    // Build admin notification HTML
    const servicesHtml =
      bookingDetails.selectedServices &&
      bookingDetails.selectedServices.length > 0
        ? `<tr><td colspan="2" style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Selected Services:</strong><ul>${bookingDetails.selectedServices
            .map((s) => `<li>${s.name} - ₹${s.price}</li>`)
            .join("")}</ul></td></tr>`
        : "";

    const hallDetailsHtml =
      bookingDetails.propertyType === "hall"
        ? `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Event Type:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${
            bookingDetails.eventType || "N/A"
          }</td>
        </tr>
        ${
          bookingDetails.timeSlot
            ? `<tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Time Slot:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${bookingDetails.timeSlot.name} (${bookingDetails.timeSlot.fromTime} - ${bookingDetails.timeSlot.toTime})</td>
        </tr>`
            : ""
        }
        ${
          bookingDetails.groomDetails
            ? `<tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Groom Name:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${bookingDetails.groomDetails.name}</td>
        </tr>`
            : ""
        }
        ${
          bookingDetails.brideDetails
            ? `<tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Bride Name:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${bookingDetails.brideDetails.name}</td>
        </tr>`
            : ""
        }
      `
        : "";

    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
            .header { background-color: #8B4513; color: white; padding: 20px; text-align: center; border-radius: 5px; }
            .content { background-color: white; padding: 20px; margin-top: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .section { margin-bottom: 20px; }
            .section h3 { color: #8B4513; border-bottom: 2px solid #8B4513; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            table tr { border-bottom: 1px solid #ddd; }
            table td { padding: 10px; }
            table td:first-child { font-weight: bold; width: 30%; color: #8B4513; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🎉 NEW BOOKING NOTIFICATION</h2>
              <p>Booking #${bookingDetails.bookingNumber}</p>
            </div>
            
            <div class="content">
              <div class="section">
                <h3>Guest Information</h3>
                <table>
                  <tr>
                    <td>Name:</td>
                    <td>${bookingDetails.firstName} ${
      bookingDetails.lastName || ""
    }</td>
                  </tr>
                  <tr>
                    <td>Email:</td>
                    <td>${bookingDetails.email}</td>
                  </tr>
                  <tr>
                    <td>Phone:</td>
                    <td>${bookingDetails.mobileNo}</td>
                  </tr>
                </table>
              </div>

              <div class="section">
                <h3>Booking Details</h3>
                <table>
                  <tr>
                    <td>Property Type:</td>
                    <td>${
                      bookingDetails.propertyType === "hall" ? "Hall" : "Room"
                    }</td>
                  </tr>
                  <tr>
                    <td>Check-In:</td>
                    <td>${checkInDate}</td>
                  </tr>
                  <tr>
                    <td>Check-Out:</td>
                    <td>${checkOutDate}</td>
                  </tr>
                  <tr>
                    <td>Number of Rooms:</td>
                    <td>${bookingDetails.numberOfRooms || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>Room Numbers:</td>
                    <td>${bookingDetails.roomNumbers || "N/A"}</td>
                  </tr>
                  <tr>
                    <td>Number of Guests:</td>
                    <td>${bookingDetails.numberOfGuests || "N/A"}</td>
                  </tr>
                  ${hallDetailsHtml}
                </table>
              </div>

              ${
                bookingDetails.selectedServices &&
                bookingDetails.selectedServices.length > 0
                  ? `
              <div class="section">
                <h3>Selected Services</h3>
                <table>
                  ${servicesHtml}
                </table>
              </div>
              `
                  : ""
              }

              <div class="section">
                <h3>Payment Information</h3>
                <table>
                  <tr>
                    <td>Total Amount:</td>
                    <td style="color: #8B4513; font-weight: bold; font-size: 18px;">${formattedAmount}</td>
                  </tr>
                  ${
                    bookingDetails.discountAmount
                      ? `<tr>
                    <td>Discount:</td>
                    <td>₹${bookingDetails.discountAmount.toFixed(2)}</td>
                  </tr>`
                      : ""
                  }
                </table>
              </div>
            </div>

            <div class="footer">
              <p>This is an automated notification from your booking system.</p>
              <p>&copy; ${new Date().getFullYear()} ${
      bookingDetails.hotelName
    }. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transport.verify();

    await transport.sendMail({
      from: {
        name: bookingDetails.hotelName,
        address: smtpConfig.from,
      },
      to: adminEmail,
      subject: `[NEW BOOKING] ${bookingDetails.firstName} ${
        bookingDetails.lastName || ""
      } - #${bookingDetails.bookingNumber}`,
      html: htmlBody,
    });

    return true;
  } catch (error) {
    console.error("Error sending admin notification email:", error);
    return false;
  }
}
