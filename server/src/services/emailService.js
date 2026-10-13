import nodemailer from "nodemailer";
import { env } from "../config/env.js";

/**
 * Escapes HTML characters to prevent XSS/injection in email templates
 */
const escapeHtml = (str) => {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

/**
 * Basic email format validation regex
 */
const isValidEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

// Singleton transporter instance
let transporterInstance = null;

/**
 * Creates or retrieves the Nodemailer SMTP transporter
 */
const getTransporter = () => {
  if (transporterInstance) {
    return transporterInstance;
  }

  if (!env.isEmailConfigured) {
    return null;
  }

  transporterInstance = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE, // true for port 465, false for 587
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_APP_PASSWORD,
    },
    connectionTimeout: 10000, // 10s
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  return transporterInstance;
};

/**
 * Verifies SMTP connection without exposing credentials
 */
export const verifyTransporter = async () => {
  if (!env.isEmailConfigured) {
    return {
      configured: false,
      message: "SMTP is not configured. (SMTP_USER or SMTP_APP_PASSWORD is missing in server/.env)",
    };
  }

  try {
    const transporter = getTransporter();
    await transporter.verify();
    return {
      configured: true,
      verified: true,
      message: "SMTP connection verified successfully.",
    };
  } catch (error) {
    return {
      configured: true,
      verified: false,
      message: `SMTP connection verification failed: ${error.message}`,
    };
  }
};

/**
 * Base layout template generator for EventSphere transactional emails
 */
const generateEmailLayout = ({ title, preheader, contentHtml }) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      color: #1e293b;
      line-height: 1.6;
    }
    .wrapper {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }
    .header {
      background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
      padding: 32px 30px;
      text-align: center;
      color: #ffffff;
    }
    .logo {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .logo span {
      color: #c7d2fe;
    }
    .tagline {
      font-size: 13px;
      color: #e0e7ff;
      margin-top: 4px;
      margin-bottom: 0;
    }
    .body-content {
      padding: 32px 30px;
    }
    .details-box {
      background-color: #f1f5f9;
      border-radius: 12px;
      padding: 20px;
      margin: 24px 0;
      border-left: 4px solid #4f46e5;
    }
    .details-item {
      margin-bottom: 10px;
      font-size: 14px;
    }
    .details-item:last-child {
      margin-bottom: 0;
    }
    .details-label {
      font-weight: 600;
      color: #475569;
      display: inline-block;
      width: 120px;
    }
    .details-value {
      color: #0f172a;
      font-weight: 500;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 700;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-approved { background-color: #dcfce7; color: #166534; }
    .badge-pending { background-color: #fef3c7; color: #92400e; }
    .badge-rejected { background-color: #fee2e2; color: #991b1b; }
    .badge-confirmed { background-color: #dcfce7; color: #166534; }
    .footer {
      background-color: #f8fafc;
      padding: 24px 30px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
    }
    .footer a {
      color: #4f46e5;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div style="display:none;font-size:1px;color:#333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${escapeHtml(preheader || title)}
  </div>
  <div class="wrapper">
    <div class="header">
      <h1 class="logo">Event<span>Sphere</span></h1>
      <p class="tagline">Smart Event &amp; Venue Management Platform</p>
    </div>
    <div class="body-content">
      ${contentHtml}
    </div>
    <div class="footer">
      <p style="margin:0 0 6px 0;">This is an automated notification from <strong>EventSphere</strong>.</p>
      <p style="margin:0;">&copy; ${new Date().getFullYear()} EventSphere. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
};

/**
 * Core sendEmail function
 * Sends real email via Nodemailer if configured, or logs safely in development.
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  // Validate recipient
  if (!isValidEmail(to)) {
    console.warn(`[Email Service] Invalid recipient address provided: "${to}". Skipping email dispatch.`);
    return { success: false, reason: "INVALID_RECIPIENT" };
  }

  // Check if SMTP is configured
  if (!env.isEmailConfigured) {
    if (env.isDevelopment) {
      console.log(`[Email Service Notice] Real email delivery not configured (SMTP credentials missing).`);
      console.log(`  To: ${to}`);
      console.log(`  Subject: ${subject}`);
    }
    return { success: false, reason: "SMTP_NOT_CONFIGURED" };
  }

  const transporter = getTransporter();
  if (!transporter) {
    return { success: false, reason: "TRANSPORTER_UNAVAILABLE" };
  }

  try {
    const info = await transporter.sendMail({
      from: env.EMAIL_FROM,
      to: to.trim(),
      subject,
      text,
      html,
    });

    if (env.isDevelopment) {
      console.log(`[Email Service] Email sent successfully to ${to} (MessageID: ${info.messageId})`);
    }

    return {
      success: true,
      messageId: info.messageId,
      accepted: info.accepted,
    };
  } catch (error) {
    // Log safe error without exposing credentials or stack traces
    console.error(`[Email Service Error] Delivery failed to ${to}: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 1. Participant Registration Confirmation Email
 */
export const sendRegistrationConfirmationEmail = async ({ participant, event }) => {
  if (!participant?.email || !event) {
    return { success: false, reason: "INSUFFICIENT_DATA" };
  }

  const subject = `Registration Confirmed – ${event.title} | EventSphere`;
  const preheader = `Your registration for ${event.title} has been confirmed.`;

  const safeParticipantName = escapeHtml(participant.name || "Participant");
  const safeEventTitle = escapeHtml(event.title);
  const safeVenue = escapeHtml(event.venue || "TBA");
  const safeCity = escapeHtml(event.city || "Mumbai");
  const safeDate = escapeHtml(event.date || "Upcoming");
  const safeTime = escapeHtml(event.time || "10:00 AM - 05:00 PM IST");
  const safeCategory = escapeHtml(event.category || "General");

  const html = generateEmailLayout({
    title: subject,
    preheader,
    contentHtml: `
      <h2 style="font-size:20px;margin-top:0;margin-bottom:12px;color:#0f172a;">Hello, ${safeParticipantName}!</h2>
      <p style="margin-top:0;color:#334155;font-size:15px;">
        Your registration for <strong>${safeEventTitle}</strong> has been successfully completed. We are excited to have you join us!
      </p>

      <div class="details-box">
        <div class="details-item">
          <span class="details-label">Event Name:</span>
          <span class="details-value">${safeEventTitle}</span>
        </div>
        <div class="details-item">
          <span class="details-label">Category:</span>
          <span class="details-value">${safeCategory}</span>
        </div>
        <div class="details-item">
          <span class="details-label">Date &amp; Time:</span>
          <span class="details-value">${safeDate} • ${safeTime}</span>
        </div>
        <div class="details-item">
          <span class="details-label">Venue:</span>
          <span class="details-value">${safeVenue}, ${safeCity}</span>
        </div>
        <div class="details-item">
          <span class="details-label">Status:</span>
          <span class="badge badge-confirmed">Confirmed</span>
        </div>
      </div>

      <p style="color:#475569;font-size:14px;margin-bottom:20px;">
        Please keep this email for your records. Arrive at the venue at least 15 minutes before the scheduled start time.
      </p>

      <p style="color:#0f172a;font-weight:600;margin-bottom:0;">
        We look forward to seeing you at the event!<br>
        <span style="font-weight:400;color:#64748b;">The EventSphere Team</span>
      </p>
    `,
  });

  const text = `Hello ${participant.name || "Participant"},

Your registration for "${event.title}" has been successfully completed.

Event Details:
- Event: ${event.title}
- Category: ${event.category || "General"}
- Date & Time: ${event.date || "Upcoming"} • ${event.time || "10:00 AM - 05:00 PM IST"}
- Venue: ${event.venue || "TBA"}, ${event.city || "Mumbai"}
- Status: Confirmed

We look forward to seeing you at the event!

Thank you,
EventSphere Team`;

  return sendEmail({
    to: participant.email,
    subject,
    html,
    text,
  });
};

/**
 * 2. Organizer Event Submission Email
 */
export const sendEventSubmissionEmail = async ({ organizer, event }) => {
  if (!organizer?.email || !event) {
    return { success: false, reason: "INSUFFICIENT_DATA" };
  }

  const subject = `Event Submitted for Review – ${event.title} | EventSphere`;
  const preheader = `Your event submission for ${event.title} has been received.`;

  const safeOrganizerName = escapeHtml(organizer.name || "Organizer");
  const safeEventTitle = escapeHtml(event.title);
  const safeVenue = escapeHtml(event.venue || "TBA");
  const safeCity = escapeHtml(event.city || "Mumbai");
  const safeDate = escapeHtml(event.date || "Upcoming");
  const safeTime = escapeHtml(event.time || "10:00 AM - 05:00 PM IST");
  const safeStatus = escapeHtml(event.approvalStatus || "PENDING");

  const html = generateEmailLayout({
    title: subject,
    preheader,
    contentHtml: `
      <h2 style="font-size:20px;margin-top:0;margin-bottom:12px;color:#0f172a;">Hello, ${safeOrganizerName}!</h2>
      <p style="margin-top:0;color:#334155;font-size:15px;">
        Your event submission <strong>${safeEventTitle}</strong> has been received and registered on the EventSphere platform.
      </p>

      <div class="details-box">
        <div class="details-item">
          <span class="details-label">Event Name:</span>
          <span class="details-value">${safeEventTitle}</span>
        </div>
        <div class="details-item">
          <span class="details-label">Date &amp; Time:</span>
          <span class="details-value">${safeDate} • ${safeTime}</span>
        </div>
        <div class="details-item">
          <span class="details-label">Venue:</span>
          <span class="details-value">${safeVenue}, ${safeCity}</span>
        </div>
        <div class="details-item">
          <span class="details-label">Approval Status:</span>
          <span class="badge badge-pending">${safeStatus}</span>
        </div>
      </div>

      <div style="background-color:#fffbeb;border:1px solid #fef3c7;border-radius:8px;padding:14px;margin-bottom:20px;">
        <p style="margin:0;font-size:13px;color:#92400e;">
          <strong>Notice:</strong> Your event is currently awaiting administrator review. It will not be published to the public catalog until an administrator reviews and approves it. You will receive an email notification as soon as the review is complete.
        </p>
      </div>

      <p style="color:#0f172a;font-weight:600;margin-bottom:0;">
        Thank you for organizing on EventSphere!<br>
        <span style="font-weight:400;color:#64748b;">The EventSphere Team</span>
      </p>
    `,
  });

  const text = `Hello ${organizer.name || "Organizer"},

Your event submission "${event.title}" has been successfully received.

Event Details:
- Title: ${event.title}
- Date & Time: ${event.date || "Upcoming"} • ${event.time || "10:00 AM - 05:00 PM IST"}
- Venue: ${event.venue || "TBA"}, ${event.city || "Mumbai"}
- Approval Status: ${event.approvalStatus || "PENDING"}

Notice: Your event is currently awaiting administrator review. Once reviewed by an administrator, you will receive an update notification.

Thank you,
EventSphere Team`;

  return sendEmail({
    to: organizer.email,
    subject,
    html,
    text,
  });
};

/**
 * 3. Organizer Event Approval Email
 */
export const sendEventApprovalEmail = async ({ organizer, event }) => {
  if (!organizer?.email || !event) {
    return { success: false, reason: "INSUFFICIENT_DATA" };
  }

  const subject = `Your Event Has Been Approved – ${event.title} | EventSphere`;
  const preheader = `Great news! Your event "${event.title}" has been approved.`;

  const safeOrganizerName = escapeHtml(organizer.name || "Organizer");
  const safeEventTitle = escapeHtml(event.title);
  const safeVenue = escapeHtml(event.venue || "TBA");
  const safeCity = escapeHtml(event.city || "Mumbai");
  const safeDate = escapeHtml(event.date || "Upcoming");
  const safeTime = escapeHtml(event.time || "10:00 AM - 05:00 PM IST");

  const html = generateEmailLayout({
    title: subject,
    preheader,
    contentHtml: `
      <h2 style="font-size:20px;margin-top:0;margin-bottom:12px;color:#0f172a;">Congratulations, ${safeOrganizerName}!</h2>
      <p style="margin-top:0;color:#334155;font-size:15px;">
        Great news! Your event <strong>${safeEventTitle}</strong> has been reviewed and <strong>approved</strong> by the platform administrator.
      </p>

      <div class="details-box">
        <div class="details-item">
          <span class="details-label">Event Name:</span>
          <span class="details-value">${safeEventTitle}</span>
        </div>
        <div class="details-item">
          <span class="details-label">Date &amp; Time:</span>
          <span class="details-value">${safeDate} • ${safeTime}</span>
        </div>
        <div class="details-item">
          <span class="details-label">Venue:</span>
          <span class="details-value">${safeVenue}, ${safeCity}</span>
        </div>
        <div class="details-item">
          <span class="details-label">Status:</span>
          <span class="badge badge-approved">PUBLISHED</span>
        </div>
      </div>

      <p style="color:#475569;font-size:14px;margin-bottom:20px;">
        Your event is now live and visible on the EventSphere public discovery catalog. Participants can now discover the event and register for tickets.
      </p>

      <p style="color:#0f172a;font-weight:600;margin-bottom:0;">
        Best wishes for a successful event!<br>
        <span style="font-weight:400;color:#64748b;">The EventSphere Team</span>
      </p>
    `,
  });

  const text = `Congratulations ${organizer.name || "Organizer"}!

Your event "${event.title}" has been approved by the platform administrator.

Event Details:
- Title: ${event.title}
- Date & Time: ${event.date || "Upcoming"} • ${event.time || "10:00 AM - 05:00 PM IST"}
- Venue: ${event.venue || "TBA"}, ${event.city || "Mumbai"}
- Status: PUBLISHED (Approved)

Your event is now live on the EventSphere public discovery catalog. Participants can now register for the event.

Thank you,
EventSphere Team`;

  return sendEmail({
    to: organizer.email,
    subject,
    html,
    text,
  });
};

/**
 * 4. Organizer Event Rejection Email
 */
export const sendEventRejectionEmail = async ({ organizer, event, reason }) => {
  if (!organizer?.email || !event) {
    return { success: false, reason: "INSUFFICIENT_DATA" };
  }

  const subject = `Update on Your Event Submission – ${event.title} | EventSphere`;
  const preheader = `Status update on your event submission for ${event.title}.`;

  const safeOrganizerName = escapeHtml(organizer.name || "Organizer");
  const safeEventTitle = escapeHtml(event.title);
  const safeReason = reason ? escapeHtml(reason) : null;

  const html = generateEmailLayout({
    title: subject,
    preheader,
    contentHtml: `
      <h2 style="font-size:20px;margin-top:0;margin-bottom:12px;color:#0f172a;">Hello, ${safeOrganizerName},</h2>
      <p style="margin-top:0;color:#334155;font-size:15px;">
        This email is an update regarding your event submission <strong>${safeEventTitle}</strong> on EventSphere.
      </p>

      <div class="details-box">
        <div class="details-item">
          <span class="details-label">Event Name:</span>
          <span class="details-value">${safeEventTitle}</span>
        </div>
        <div class="details-item">
          <span class="details-label">Approval Status:</span>
          <span class="badge badge-rejected">REJECTED</span>
        </div>
        ${
          safeReason
            ? `<div class="details-item">
                <span class="details-label">Reason:</span>
                <span class="details-value">${safeReason}</span>
              </div>`
            : ""
        }
      </div>

      <p style="color:#475569;font-size:14px;margin-bottom:20px;">
        After review by the platform administrator, this submission was not approved for public publication. If you have questions or wish to update the event details, please consult your administrator.
      </p>

      <p style="color:#0f172a;font-weight:600;margin-bottom:0;">
        Regards,<br>
        <span style="font-weight:400;color:#64748b;">The EventSphere Team</span>
      </p>
    `,
  });

  const text = `Hello ${organizer.name || "Organizer"},

This email is an update regarding your event submission "${event.title}".

Status: REJECTED
${reason ? `Reason: ${reason}\n` : ""}
After review by the platform administrator, this submission was not approved for publication.

Regards,
EventSphere Team`;

  return sendEmail({
    to: organizer.email,
    subject,
    html,
    text,
  });
};
