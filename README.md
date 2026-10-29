# Amber's Salon — website package

A static, responsive two-page website for **Amber's Salon**, CCA-109 DHA Phase 6, Lahore.

## Files

- `index.html` — home, services, gallery, review demo, salon details, booking widget.
- `prices.html` — complete searchable price catalogue (314 priced options in 13 categories).
- `assets/prices-data.js` / `assets/prices-data.json` — exact items and prices from your supplied document, including price ranges.
- `assets/styles.css` — responsive design.
- `assets/site.js` — interactive menu, booking, WhatsApp, gallery fallback, reviews.
- `assets/prices.js` — search and filter of price items.
- `assets/img/ambers-logo.png` — logo you supplied, preserving the circular brand mark.
- `assets/instagram/` — slot for **your own real Instagram photos**.
- `assets/stock/` — downloadable stock-photo manifest and bundled offline SVG illustrations.
- `scripts/download_stock_images.py` — downloads free stock photographs to be self-hosted.

## Instagram media — important

Instagram would not make the public photos of @ambersalon.official available to this environment. **No Instagram account photographs have been extracted or bundled.** The Instagram profile itself is linked throughout the site.

To display your original posts, use Instagram's official data export or your original photographs (ensure client photo consent), and put up to 6 JPEG photos in `assets/instagram/` named `01.jpg` through `06.jpg`. The gallery automatically uses them. Otherwise, the website transparently displays editorial stock pictures/illustrations.

## Getting actual stock photos into the local folder

The HTML is already configured to try `assets/stock/*.jpg` first, then source Unsplash URLs, then the built-in offline SVG illustrations. The JPEG files could not be downloaded in this environment because outbound asset downloads were unavailable.

On a computer with internet access, run:

```bash
python scripts/download_stock_images.py
```

This saves eight JPEG photos directly inside `assets/stock/` for self-hosting with the site, after which the site no longer depends on the remote photo URLs. Sources are in `assets/stock/sources.json`. Unsplash photographs are free for most commercial use under https://unsplash.com/license (terms for recognizable subjects and branding still apply).

## How to deploy

1. Unzip this package and **keep the folder structure unchanged**.
2. Optional but recommended: run the above stock downloader, and add real Instagram photos.
3. Upload the **contents** of this folder to a static host such as cPanel `public_html`, Netlify, or Vercel static hosting.
4. Keep `index.html`, `prices.html` and `assets/` in the same published root.
5. Navigate to your site or open `index.html` directly.

All menus, searchable prices and the WhatsApp booking form work without any backend. If a visitor uses booking, the form opens WhatsApp to `+92 301 439 8287` with the service, name, requested date and time. The salon must still confirm availability. Clicking phone and Google Maps links opens the respective external apps.

## Reviews

The review section is deliberately a **local-only, honest demo**: a visitor can preview a review, saved in that browser's local storage. It is **not shared between visitors**, not backed by a server and should not be represented as publicly published customer feedback. Feedback may also be sent via WhatsApp. For public reviews, integrate a database, authentication/spam protection and moderation or an official review platform widget.

## Unverified info avoided

No fabricated reviews, courses, Facebook/TikTok profiles, postal pins, memberships or credentials. The supplied business hours are shown as 11:00 AM–8:00 PM without assuming individual weekday/holiday availability. Prices are subject to change and should be confirmed with the salon.

## Contact in site

- Instagram: https://www.instagram.com/ambersalon.official/?hl=en
- WhatsApp: https://wa.me/923014398287
- Phone: 0301-4398287
- Location: CCA-109, DHA Phase 6, Lahore
- Timings: 11:00 AM – 8:00 PM


## Refreshed price menu — October 2026

The updated `index.html` shows six accurate service-price examples, clickable category links, and a homepage price search.

The dedicated `prices.html` has searchable and filterable 314 priced options across 13 categories. It includes improved mobile cards, a printable view, and WhatsApp enquiries. It uses `assets/refined.css` after the original stylesheet for the custom Midnight Plum + Mint Sage + Champagne palette.

All pricing is transcribed from the price list supplied by the salon. The menu states that prices may change; please confirm with the salon before booking.
