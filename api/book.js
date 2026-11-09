/**
 * Amber's Salon — Vercel Serverless Booking API Route
 * Handles booking requests, server validation, anti-spam honeypot, rate limiting,
 * branded HTML email confirmation via Resend, and WhatsApp notification via Meta Cloud API / Twilio.
 */
'use strict';

// In-memory rate limiting map (IP -> array of timestamps)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 6;

function isRateLimited(ip) {
  if (!ip) return false;
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) || []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return false;
}

// Pakistan mobile number sanitization to international format +923XXXXXXXXX
function formatPakistanPhone(phone) {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.startsWith('923') && digits.length === 12) {
    return `+${digits}`;
  }
  if (digits.startsWith('03') && digits.length === 11) {
    return `+92${digits.slice(1)}`;
  }
  if (digits.startsWith('3') && digits.length === 10) {
    return `+92${digits}`;
  }
  return phone;
}

// Generate branded HTML email
function generateBookingEmailHtml(data, bookingId) {
  const { name, phone, email, category, service, date, time, guests, note } = data;
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Appointment Request — Amber's Salon</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f7f1f3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2b2531; }
    .wrapper { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 35px rgba(48,37,57,0.08); border: 1px solid #ebdbe2; }
    .header { background: #302539; padding: 36px 30px; text-align: center; color: #ffffff; }
    .logo-title { font-family: Georgia, serif; font-size: 30px; font-weight: normal; margin: 0; letter-spacing: 0.02em; }
    .logo-sub { font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #d6af8a; display: block; margin-top: 6px; }
    .body { padding: 36px 32px; }
    .greeting { font-family: Georgia, serif; font-size: 24px; color: #302539; margin: 0 0 12px; }
    .lead { font-size: 15px; line-height: 1.6; color: #6c646d; margin: 0 0 24px; }
    .summary-card { background: #fbf7f9; border: 1px solid #e9dce3; border-radius: 12px; padding: 20px 24px; margin-bottom: 26px; }
    .summary-row { display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid #f0e4ea; font-size: 14px; }
    .summary-row:last-child { border-bottom: none; }
    .label { color: #857481; font-weight: 500; }
    .value { color: #302539; font-weight: 600; text-align: right; }
    .ref-badge { display: inline-block; background: #ebdce3; color: #5c3552; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; }
    .note-box { background: #fffcf8; border-left: 4px solid #b58b64; padding: 14px 16px; font-size: 13.5px; line-height: 1.5; color: #6b5c53; margin-bottom: 24px; border-radius: 0 8px 8px 0; }
    .salon-info { border-top: 1px solid #f0e4ea; padding-top: 24px; margin-top: 24px; }
    .salon-info h4 { font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #8c5874; margin: 0 0 10px; }
    .salon-info p { font-size: 13.5px; line-height: 1.6; color: #6c646d; margin: 0 0 6px; }
    .btn { display: inline-block; background: #302539; color: #ffffff !important; padding: 13px 26px; border-radius: 25px; text-decoration: none; font-size: 13px; font-weight: 600; letter-spacing: 0.04em; margin-top: 14px; }
    .footer { background: #261c2e; padding: 24px 30px; text-align: center; font-size: 12px; color: #beaab7; line-height: 1.6; }
    .footer a { color: #d6af8a; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1 class="logo-title">Amber's Salon</h1>
      <span class="logo-sub">DHA Phase 6 · Lahore</span>
    </div>
    <div class="body">
      <div style="text-align: right; margin-bottom: 15px;">
        <span class="ref-badge">Ref: #${bookingId}</span>
      </div>
      <h2 class="greeting">Thank you, ${name}!</h2>
      <p class="lead">We have received your appointment request. Our salon concierge in DHA Phase 6, Lahore will confirm your slot shortly.</p>
      
      <div class="summary-card">
        <div class="summary-row"><span class="label">Service</span><span class="value">${service}</span></div>
        <div class="summary-row"><span class="label">Category</span><span class="value">${category || 'Salon Service'}</span></div>
        <div class="summary-row"><span class="label">Date</span><span class="value">${date}</span></div>
        <div class="summary-row"><span class="label">Preferred Time</span><span class="value">${time}</span></div>
        <div class="summary-row"><span class="label">Guests</span><span class="value">${guests || '1 Person'}</span></div>
        <div class="summary-row"><span class="label">Phone / WhatsApp</span><span class="value">${phone}</span></div>
        ${note ? `<div class="summary-row"><span class="label">Special Requests</span><span class="value">${note}</span></div>` : ''}
      </div>

      <div class="note-box">
        <strong>Important notice:</strong> All appointments are confirmed directly by Amber's Salon. If your chosen slot is unavailable, our team will provide the nearest available timings.
      </div>

      <div class="salon-info">
        <h4>Visit Our Salon</h4>
        <p><strong>Address:</strong> CCA-109, DHA Phase 6, Lahore, Pakistan</p>
        <p><strong>Opening Hours:</strong> 11:00 AM – 8:00 PM (Daily)</p>
        <p><strong>Direct Helpline / WhatsApp:</strong> 0301-4398287</p>
        <a class="btn" href="https://www.google.com/maps/search/?api=1&query=CCA-109%2C%20DHA%20Phase%206%2C%20Lahore" target="_blank" rel="noopener noreferrer">Get Directions on Google Maps ↗</a>
      </div>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Amber's Salon Lahore. All rights reserved.<br>
      <a href="https://ambersaloon.vercel.app">ambersaloon.vercel.app</a> · <a href="https://wa.me/923014398287">WhatsApp Concierge</a>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// Resend Email Sender (Native fetch, zero dependencies)
async function sendResendEmail(apiKey, fromEmail, toEmail, salonEmail, subject, html) {
  if (!apiKey) return { sent: false, reason: 'RESEND_API_KEY missing' };

  try {
    const recipients = [toEmail];
    if (salonEmail && salonEmail !== toEmail) {
      recipients.push(salonEmail);
    }

    const payload = {
      from: fromEmail || "Amber's Salon <onboarding@resend.dev>",
      to: recipients,
      subject: subject,
      html: html
    };

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      return { sent: true, id: data.id };
    }
    return { sent: false, error: data };
  } catch (err) {
    return { sent: false, error: err.message };
  }
}

// Meta WhatsApp Cloud API Message Sender (Native fetch)
async function sendMetaWhatsAppMessage(token, phoneId, templateName, customerPhone, data, bookingId) {
  if (!token || !phoneId) return { sent: false, reason: 'WhatsApp API credentials missing' };

  const cleanPhone = customerPhone.replace(/\D/g, '');
  const url = `https://graph.facebook.com/v18.0/${phoneId}/messages`;

  // Payload for Cloud API: Either template or custom text
  const payload = templateName ? {
    messaging_product: 'whatsapp',
    to: cleanPhone,
    type: 'template',
    template: {
      name: templateName,
      language: { code: 'en' },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: data.name },
            { type: 'text', text: data.service },
            { type: 'text', text: `${data.date} at ${data.time}` }
          ]
        }
      ]
    }
  } : {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: cleanPhone,
    type: 'text',
    text: {
      preview_url: false,
      body: `Hello ${data.name}! Your appointment request with Amber's Salon (Ref #${bookingId}) has been received.\n\nService: ${data.service}\nDate & Time: ${data.date} at ${data.time}\nLocation: CCA-109 DHA Phase 6, Lahore.\n\nOur team will confirm your slot shortly.`
    }
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const result = await res.json().catch(() => ({}));
    return { sent: res.ok, result };
  } catch (err) {
    return { sent: false, error: err.message };
  }
}

// Main Vercel Serverless Function Handler
export default async function handler(req, res) {
  // CORS & Preflight
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  // Rate Limiting by IP
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Too many booking attempts. Please try again in a few minutes or message us on WhatsApp.' });
  }

  const body = req.body || {};

  // Honeypot anti-spam check
  if (body.website_url_hp) {
    // Silently succeed for bots
    return res.status(200).json({ success: true, message: 'Received' });
  }

  const { name, phone, email, category, service, date, time, guests, note, consent } = body;

  // Validation
  if (!name || !phone || !email || !service || !date || !time) {
    return res.status(400).json({ error: 'Missing required booking fields (name, phone, email, service, date, time).' });
  }

  if (!consent) {
    return res.status(400).json({ error: 'Consent to receive updates is required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  const formattedPhone = formatPakistanPhone(phone);
  const bookingId = Math.random().toString(36).substring(2, 8).toUpperCase();

  // Pre-generate fallback WhatsApp message
  const fallbackMsg = `Hello Amber's Salon, I'd like to book an appointment (Ref #${bookingId}).\n\nName: ${name}\nPhone: ${formattedPhone}\nEmail: ${email}\nCategory: ${category || 'General'}\nService: ${service}\nPreferred Date: ${date}\nPreferred Time: ${time}\nGuests: ${guests || '1'}${note ? `\nNotes: ${note}` : ''}\n\nPlease confirm availability. Thank you.`;
  const fallbackWhatsAppUrl = `https://wa.me/923014398287?text=${encodeURIComponent(fallbackMsg)}`;

  // Environment variables
  const RESEND_KEY = process.env.RESEND_API_KEY;
  const SALON_EMAIL = process.env.SALON_EMAIL || 'ambersaloonlahore@gmail.com';
  const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Amber's Salon <bookings@ambersaloon.vercel.app>";
  const WA_TOKEN = process.env.WHATSAPP_TOKEN;
  const WA_PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const WA_TEMPLATE = process.env.WHATSAPP_TEMPLATE_NAME;

  const emailHtml = generateBookingEmailHtml({
    name,
    phone: formattedPhone,
    email,
    category,
    service,
    date,
    time,
    guests,
    note
  }, bookingId);

  // Send Email & WhatsApp in parallel
  const [emailResult, waResult] = await Promise.all([
    sendResendEmail(RESEND_KEY, FROM_EMAIL, email, SALON_EMAIL, `Appointment Request Received — Amber's Salon (#${bookingId})`, emailHtml),
    sendMetaWhatsAppMessage(WA_TOKEN, WA_PHONE_ID, WA_TEMPLATE, formattedPhone, { name, service, date, time }, bookingId)
  ]);

  return res.status(200).json({
    success: true,
    bookingId,
    message: 'Booking request successfully received',
    emailSent: emailResult.sent,
    whatsappSent: waResult.sent,
    fallbackWhatsAppUrl,
    details: {
      name,
      service,
      date,
      time,
      formattedPhone
    }
  });
}
