import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

const app = express();
const PORT = 3000;
const BOOKINGS_FILE = path.join(process.cwd(), "bookings.json");

app.use(express.json());

// Initialize bookings.json if not present
if (!fs.existsSync(BOOKINGS_FILE)) {
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify([], null, 2), "utf8");
}

// Helper to read bookings
function readBookings() {
  try {
    const data = fs.readFileSync(BOOKINGS_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading bookings file:", err);
    return [];
  }
}

// Helper to write bookings
function writeBookings(bookings: any[]) {
  try {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing bookings file:", err);
  }
}

// Helper to send email notification
async function sendBookingEmail(booking: any): Promise<boolean> {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = parseInt(process.env.SMTP_PORT || "587");

  const emailText = `
    New Service Booking received for Experts Automotive Center!
    
    Customer Details:
    ------------------
    Full Name: ${booking.fullName}
    Phone Number: ${booking.phoneNumber}
    Email Address: ${booking.email || "N/A"}
    
    Vehicle Details:
    ------------------
    Brand: ${booking.brand}
    Model: ${booking.model}
    Year: ${booking.year}
    
    Appointment Details:
    ---------------------
    Service Type: ${booking.serviceType}
    Date: ${booking.date}
    Branch: ${booking.branch}
    
    Notes:
    ------
    ${booking.notes || "None"}
    
    Submitted at: ${new Date(booking.createdAt).toLocaleString()}
  `;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <div style="background-color: #0b0b0b; padding: 24px; text-align: center; border-bottom: 3px solid #dc2626;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; font-weight: bold;">Experts <span style="color: #dc2626;">Automotive</span> Center</h1>
        <p style="color: #a3a3a3; margin: 4px 0 0 0; font-size: 14px;">New Service Booking Request</p>
      </div>
      <div style="padding: 24px; background-color: #ffffff; color: #333333; line-height: 1.6;">
        <h2 style="color: #111111; border-bottom: 1px solid #eeeeee; padding-bottom: 8px; margin-top: 0; font-size: 18px;">Customer Information</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 6px 0; font-weight: bold; width: 130px; color: #666666; font-size: 14px;">Full Name:</td>
            <td style="padding: 6px 0; color: #111111; font-size: 14px;">${booking.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #666666; font-size: 14px;">Phone:</td>
            <td style="padding: 6px 0; color: #111111; font-size: 14px;"><a href="tel:${booking.phoneNumber}" style="color: #dc2626; text-decoration: none; font-weight: bold;">${booking.phoneNumber}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #666666; font-size: 14px;">Email:</td>
            <td style="padding: 6px 0; color: #111111; font-size: 14px;"><a href="mailto:${booking.email}" style="color: #dc2626; text-decoration: none;">${booking.email || "N/A"}</a></td>
          </tr>
        </table>

        <h2 style="color: #111111; border-bottom: 1px solid #eeeeee; padding-bottom: 8px; font-size: 18px;">Vehicle Information</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 6px 0; font-weight: bold; width: 130px; color: #666666; font-size: 14px;">Brand:</td>
            <td style="padding: 6px 0; color: #111111; font-size: 14px;">${booking.brand}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #666666; font-size: 14px;">Model:</td>
            <td style="padding: 6px 0; color: #111111; font-size: 14px;">${booking.model}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #666666; font-size: 14px;">Year:</td>
            <td style="padding: 6px 0; color: #111111; font-size: 14px;">${booking.year}</td>
          </tr>
        </table>

        <h2 style="color: #111111; border-bottom: 1px solid #eeeeee; padding-bottom: 8px; font-size: 18px;">Appointment Details</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 6px 0; font-weight: bold; width: 130px; color: #666666; font-size: 14px;">Service:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #dc2626; font-size: 14px;">${booking.serviceType}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #666666; font-size: 14px;">Date:</td>
            <td style="padding: 6px 0; color: #111111; font-size: 14px;">${booking.date}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #666666; font-size: 14px;">Branch:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #111111; font-size: 14px;">${booking.branch}</td>
          </tr>
        </table>

        ${booking.notes ? `
          <h2 style="color: #111111; border-bottom: 1px solid #eeeeee; padding-bottom: 8px; font-size: 18px;">Additional Notes</h2>
          <p style="background-color: #f9f9f9; padding: 12px; border-left: 4px solid #dc2626; border-radius: 4px; margin: 0 0 20px 0; font-style: italic; font-size: 14px; color: #555555;">${booking.notes}</p>
        ` : ""}
      </div>
      <div style="background-color: #f5f5f5; padding: 16px; text-align: center; border-top: 1px solid #e0e0e0; font-size: 12px; color: #888888;">
        This is an automated notification from Experts Automotive Center website.<br>
        Submitted at: ${new Date(booking.createdAt).toLocaleString()}
      </div>
    </div>
  `;

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"Experts Automotive Center" <${smtpUser}>`,
        to: "expertsautomotive3@gmail.com",
        subject: `[New Booking] ${booking.fullName} - ${booking.brand} ${booking.model} (${booking.serviceType})`,
        text: emailText,
        html: emailHtml,
      });
      console.log(`Email successfully sent to expertsautomotive3@gmail.com`);
      return true;
    } catch (err) {
      console.error("Failed to send email via SMTP transporter:", err);
      return false;
    }
  } else {
    console.log("=========================================");
    console.log("SMTP NOT CONFIGURED. Booking Details would be sent to: expertsautomotive3@gmail.com");
    console.log(emailText);
    console.log("=========================================");
    return false;
  }
}

// Helper to send booking confirmation to the customer
async function sendCustomerConfirmationEmail(booking: any): Promise<boolean> {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = parseInt(process.env.SMTP_PORT || "587");

  const emailText = `
    Dear ${booking.fullName},

    We are pleased to inform you that your service booking has been confirmed! We are looking forward to having you at Experts Automotive Center.

    Booking Details:
    ------------------
    Booking ID: ${booking.id}
    Vehicle: ${booking.year} ${booking.brand} ${booking.model}
    Service Required: ${booking.serviceType}
    Appointment Date: ${booking.date}
    Location: ${booking.branch}

    If you need to change your appointment or have any questions, please contact us at:
    Phone: +974 30038280
    Email: expertsautomotive3@gmail.com

    We would like to confirm for you your booking and we are looking forward to have you in our garage.

    Best regards,
    The Experts Automotive Center Team
  `;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); background-color: #ffffff;">
      <div style="background-color: #0b0b0b; padding: 24px; text-align: center; border-bottom: 3px solid #dc2626;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; font-weight: bold;">Experts <span style="color: #dc2626;">Automotive</span> Center</h1>
        <p style="color: #a3a3a3; margin: 4px 0 0 0; font-size: 14px;">Booking Confirmed</p>
      </div>
      <div style="padding: 24px; background-color: #ffffff; color: #333333; line-height: 1.6;">
        <p style="font-size: 16px; margin-top: 0; color: #111111;">Dear <strong>${booking.fullName}</strong>,</p>
        
        <p style="font-size: 15px; color: #444444;">
          We are pleased to inform you that your service booking has been <strong>confirmed</strong>! We would like to confirm for you your booking and we are looking forward to have you in our garage.
        </p>

        <div style="background-color: #f9f9f9; padding: 20px; border-left: 4px solid #dc2626; border-radius: 4px; margin: 24px 0;">
          <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 16px; color: #111111; border-bottom: 1px solid #eeeeee; padding-bottom: 6px;">Your Booking Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 0; font-weight: bold; width: 140px; color: #666666; font-size: 14px;">Booking ID:</td>
              <td style="padding: 4px 0; color: #111111; font-size: 14px; font-family: monospace;">${booking.id}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: bold; color: #666666; font-size: 14px;">Vehicle:</td>
              <td style="padding: 4px 0; color: #111111; font-size: 14px;">${booking.year} ${booking.brand} ${booking.model}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: bold; color: #666666; font-size: 14px;">Service Type:</td>
              <td style="padding: 4px 0; color: #111111; font-size: 14px;">${booking.serviceType}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: bold; color: #666666; font-size: 14px;">Appointment Date:</td>
              <td style="padding: 4px 0; color: #dc2626; font-weight: bold; font-size: 14px;">${booking.date}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: bold; color: #666666; font-size: 14px;">Location:</td>
              <td style="padding: 4px 0; color: #111111; font-size: 14px;">${booking.branch}</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 14px; color: #444444; margin-bottom: 0;">
          If you need to change your appointment, reschedule, or have any other questions, please contact our support team at <strong style="color: #dc2626;">+974 30038280</strong>.
        </p>
      </div>
      <div style="background-color: #f5f5f5; padding: 16px; text-align: center; border-top: 1px solid #e0e0e0; font-size: 12px; color: #888888;">
        &copy; ${new Date().getFullYear()} Experts Automotive Center. All rights reserved.
      </div>
    </div>
  `;

  if (!booking.email || !booking.email.trim()) {
    console.log("No email address provided for customer booking:", booking.id);
    return false;
  }

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"Experts Automotive Center" <${smtpUser}>`,
        to: booking.email.trim(),
        subject: `[Confirmed] Your Service Booking #${booking.id} - Experts Automotive Center`,
        text: emailText,
        html: emailHtml,
      });
      console.log(`Confirmation email successfully sent to customer: ${booking.email}`);
      return true;
    } catch (err) {
      console.error("Failed to send customer confirmation email via SMTP transporter:", err);
      return false;
    }
  } else {
    console.log("=========================================");
    console.log(`SMTP NOT CONFIGURED. Customer confirmation email would be sent to: ${booking.email}`);
    console.log(emailText);
    console.log("=========================================");
    return false;
  }
}

// Helper to send pickup ready email to the customer
async function sendCustomerPickupReadyEmail(booking: any): Promise<boolean> {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = parseInt(process.env.SMTP_PORT || "587");

  const emailText = `
    Dear ${booking.fullName},

    Great news! We have successfully completed the service and repairs on your vehicle at Experts Automotive Center. Your car is now fully ready for pickup!

    Vehicle Details:
    ------------------
    Vehicle: ${booking.year} ${booking.brand} ${booking.model}
    Service Completed: ${booking.serviceType}
    Location: ${booking.branch}

    You can come to our garage anytime during our working hours to pick up your vehicle:
    Saturday – Thursday: 8:00 AM – 1:00 PM & 3:00 PM – 8:00 PM
    Friday: Closed

    Contact Details:
    Phone: +974 30038280
    Email: expertsautomotive3@gmail.com

    We have successfully completed all work on your car, and we are looking forward to seeing you for the pickup.

    Best regards,
    The Experts Automotive Center Team
  `;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); background-color: #ffffff;">
      <div style="background-color: #0b0b0b; padding: 24px; text-align: center; border-bottom: 3px solid #dc2626;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; font-weight: bold;">Experts <span style="color: #dc2626;">Automotive</span> Center</h1>
        <p style="color: #a3a3a3; margin: 4px 0 0 0; font-size: 14px;">Vehicle Ready for Pickup</p>
      </div>
      <div style="padding: 24px; background-color: #ffffff; color: #333333; line-height: 1.6;">
        <p style="font-size: 16px; margin-top: 0; color: #111111;">Dear <strong>${booking.fullName}</strong>,</p>
        
        <p style="font-size: 15px; color: #444444;">
          Great news! We have successfully completed the service and repairs on your vehicle. Your car is now <strong>fully ready for pickup</strong>! You are welcome to come and pick it up at your earliest convenience.
        </p>

        <div style="background-color: #f9f9f9; padding: 20px; border-left: 4px solid #3b82f6; border-radius: 4px; margin: 24px 0;">
          <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 16px; color: #111111; border-bottom: 1px solid #eeeeee; padding-bottom: 6px;">Vehicle & Service Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 0; font-weight: bold; width: 140px; color: #666666; font-size: 14px;">Booking ID:</td>
              <td style="padding: 4px 0; color: #111111; font-size: 14px; font-family: monospace;">${booking.id}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: bold; color: #666666; font-size: 14px;">Vehicle:</td>
              <td style="padding: 4px 0; color: #111111; font-size: 14px;">${booking.year} ${booking.brand} ${booking.model}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: bold; color: #666666; font-size: 14px;">Completed Service:</td>
              <td style="padding: 4px 0; color: #111111; font-size: 14px;">${booking.serviceType}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: bold; color: #666666; font-size: 14px;">Location:</td>
              <td style="padding: 4px 0; color: #111111; font-size: 14px;">${booking.branch}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #eff6ff; padding: 16px; border-radius: 8px; margin-bottom: 24px; border: 1px solid #bfdbfe;">
          <p style="margin: 0; font-size: 14px; color: #1e40af; font-weight: bold;">📍 Collection Details:</p>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #1e3a8a;">
            Please visit us at our main facility in the <strong>Industrial Area (Street 8)</strong>. 
            Our doors are open Saturday – Thursday: 8:00 AM – 1:00 PM & 3:00 PM – 8:00 PM.
          </p>
        </div>

        <p style="font-size: 14px; color: #444444; margin-bottom: 0;">
          If you have any questions before your arrival, please call us directly at <strong style="color: #dc2626;">+974 30038280</strong>.
        </p>
      </div>
      <div style="background-color: #f5f5f5; padding: 16px; text-align: center; border-top: 1px solid #e0e0e0; font-size: 12px; color: #888888;">
        &copy; ${new Date().getFullYear()} Experts Automotive Center. All rights reserved.
      </div>
    </div>
  `;

  if (!booking.email || !booking.email.trim()) {
    console.log("No email address provided for customer pickup ready notification:", booking.id);
    return false;
  }

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"Experts Automotive Center" <${smtpUser}>`,
        to: booking.email.trim(),
        subject: `[Ready for Pickup] Your Vehicle is Ready! #${booking.id} - Experts Automotive Center`,
        text: emailText,
        html: emailHtml,
      });
      console.log(`Pickup ready email successfully sent to customer: ${booking.email}`);
      return true;
    } catch (err) {
      console.error("Failed to send customer pickup ready email via SMTP transporter:", err);
      return false;
    }
  } else {
    console.log("=========================================");
    console.log(`SMTP NOT CONFIGURED. Customer pickup ready email would be sent to: ${booking.email}`);
    console.log(emailText);
    console.log("=========================================");
    return false;
  }
}

// --- API Endpoints ---

// Get all bookings (for Admin Dashboard)
app.get("/api/bookings", (req, res) => {
  const bookings = readBookings();
  res.json(bookings);
});

// Create new booking
app.post("/api/bookings", async (req, res) => {
  try {
    const { fullName, phoneNumber, email, brand, model, year, serviceType, date, branch, notes } = req.body;

    if (!fullName || !phoneNumber || !email || !brand || !model || !year || !serviceType || !date || !branch) {
      return res.status(400).json({ error: "All required fields must be completed." });
    }

    const bookings = readBookings();
    const newBooking = {
      id: "BK_" + Math.random().toString(36).substring(2, 11).toUpperCase(),
      fullName,
      phoneNumber,
      email,
      brand,
      model,
      year,
      serviceType,
      date,
      branch,
      notes: notes || "",
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    bookings.unshift(newBooking);
    writeBookings(bookings);

    // Attempt to send email
    const emailSent = await sendBookingEmail(newBooking);

    res.status(201).json({
      success: true,
      booking: newBooking,
      emailSent,
      message: emailSent
        ? "Booking registered and notification email sent successfully."
        : "Booking registered locally. Email notification simulated on server console (SMTP not configured).",
    });
  } catch (error: any) {
    console.error("Booking error:", error);
    res.status(500).json({ error: "Server error during booking registration." });
  }
});

// Update booking status
app.patch("/api/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required." });
    }

    const bookings = readBookings();
    const index = bookings.findIndex((b: any) => b.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Booking not found." });
    }

    const previousStatus = bookings[index].status;
    bookings[index].status = status;
    writeBookings(bookings);

    let customerEmailSent = false;
    let messageText = "Booking status updated successfully.";

    // If status has been updated to Confirmed, send email confirmation to customer
    if (status === "Confirmed" && previousStatus !== "Confirmed") {
      customerEmailSent = await sendCustomerConfirmationEmail(bookings[index]);
      messageText = customerEmailSent 
        ? "Booking confirmed and email sent to customer." 
        : "Booking confirmed. Customer email simulation logged to server console.";
    } else if (status === "Completed" && previousStatus !== "Completed") {
      customerEmailSent = await sendCustomerPickupReadyEmail(bookings[index]);
      messageText = customerEmailSent 
        ? "Service completed and ready for pickup email sent to customer." 
        : "Service completed. Customer pickup email simulation logged to server console.";
    }

    res.json({ 
      success: true, 
      booking: bookings[index],
      customerEmailSent,
      message: messageText
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ error: "Server error during booking update." });
  }
});

// Delete booking
app.delete("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  let bookings = readBookings();
  const originalLength = bookings.length;
  bookings = bookings.filter((b: any) => b.id !== id);

  if (bookings.length === originalLength) {
    return res.status(404).json({ error: "Booking not found." });
  }

  writeBookings(bookings);
  res.json({ success: true, message: "Booking deleted successfully." });
});

// Start Vite middleware or serve static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: any, res: any) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
