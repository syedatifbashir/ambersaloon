# Amber's Salon — Setup & Credentials Guide

This guide walks you through the 3 simple steps to activate the **Hero Video**, **Automated Email Confirmations**, and **WhatsApp Cloud Notifications** on your live Vercel deployment.

---

## 1. Hero Arch Video (`hero.mp4`)
- Place your video file at:
  ```
  assets/videos/hero.mp4
  ```
  *(Optionally, you can also place `assets/videos/hero.webm` alongside it for maximum browser coverage).*
- **Specifications**:
  - MP4 (H.264), no audio track (muted), compressed to 720p/1080p (~1–3 MB).
  - The arch frame automatically applies `object-fit: cover` to fill the arch shape cleanly.
  - **Graceful Fallback**: If the video is loading, fails to load, or the user has enabled *prefers-reduced-motion*, the site seamlessly displays the existing `assets/stock/hero.jpg` cover photo.

---

## 2. Automated Email Confirmations (Resend)
We use **Resend** because it requires zero server setup, has 99.9% inbox delivery, and offers a generous free tier of **3,000 emails/month** (100 emails/day).

### How to get your API Key:
1. Go to [https://resend.com/](https://resend.com/) and sign up with your email (or GitHub).
2. Click **API Keys** on the left menu -> **Create API Key**.
3. Name it `ambers-salon-production` with **Full Access** -> click **Add**.
4. Copy the key starting with `re_...`.

*(Note: During initial testing, emails can be sent from `onboarding@resend.dev` to your registered email. Once ready, you can add your domain in Resend for custom branded sending).*

---

## 3. Automated WhatsApp Messages (Meta Cloud API)
To send official automated WhatsApp messages to customers and the salon:

### How to get your Meta WhatsApp Credentials:
1. Go to [Meta for Developers](https://developers.facebook.com/) and log in with your Facebook account.
2. Click **My Apps** -> **Create App** -> Select **Other** -> Select **Business**.
3. In your app dashboard, find **WhatsApp** and click **Set up**.
4. You will see your sandbox dashboard:
   - **Phone Number ID**: A 15-digit number (e.g. `109283746501928`).
   - **Temporary Access Token** or create a **Permanent System User Token** under *Business Settings > System Users*.
5. (Optional) Under **Message Templates**, create a template named `appointment_confirmation` with parameters for Customer Name, Service, and Date/Time.

---

## 4. How to Add Environment Variables in Vercel

1. Log into your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click on your project: **`ambersaloon`**.
3. Go to **Settings** (top navigation tab) -> select **Environment Variables** (left sidebar).
4. Add the following variables:

| Variable Name | Value | Description |
| :--- | :--- | :--- |
| `RESEND_API_KEY` | `re_xxxxxxxxxxxxxx` | Your Resend API key |
| `SALON_EMAIL` | `ambersaloonlahore@gmail.com` | Salon's notification email |
| `RESEND_FROM_EMAIL` | `Amber's Salon <onboarding@resend.dev>` | Sender email address |
| `WHATSAPP_TOKEN` | `EAAG...` | Meta WhatsApp Cloud API Token |
| `WHATSAPP_PHONE_NUMBER_ID` | `109283746501928` | Meta Phone Number ID |
| `WHATSAPP_TEMPLATE_NAME` | *(leave blank or template name)* | Meta approved template |

5. Click **Save**.
6. Trigger a redeploy (or push any commit) so Vercel applies the new environment variables.

---

## 5. Fail-Safe Guarantee (Zero Lost Bookings)
If environment variables have not yet been added or if an external API experiences temporary downtime:
- The system **automatically catches the error** and displays a 1-click fallback button inside the booking modal:
  `"Continue to WhatsApp Confirmation ↗"`
- This pre-fills WhatsApp with all customer-entered details (Name, Pakistan Mobile, Email, Category, Service & Price, Date, Time, Guests, and Notes) directly to the salon number **`0301-4398287`**.
- **No booking request is ever lost.**
