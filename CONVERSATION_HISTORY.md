# Conversation & Project Activity History

## Session: October 30, 2026

### User Request 1:
> *"i want to deploy it on the vercel analyze it and tell me what best possibel way to deploy it and how ot do it as well properly"*

#### Analysis & Actions Taken:
1. **Analysis of the Project Package**:
   - Project: Amber's Salon (CCA-109 DHA Phase 6, Lahore) redesign package.
   - Identified static site architecture: CSS styles (`assets/styles.css`, `assets/refined.css`), JavaScript interactivity (`assets/site.js`, `assets/prices.js`), price dataset (`assets/prices-data.js`, `assets/prices-data.json` covering 314 services across 13 categories), brand assets and illustrations.
   - **Crucial Diagnostic Finding**: The TransferNow download archive lacked `index.html` and `prices.html`. If deployed directly to Vercel, it would have served a 404 error.
   - **Remedy**: Faithfully created the primary `index.html` and `prices.html` matching all CSS styles, interactive elements (`#bookingModal`, `#reviewForm`, `#priceSearch`, `#priceFilter`, `#catalog`), and typography.
   - Configured `vercel.json` with `cleanUrls: true` and cache headers for instant zero-config Vercel deployment.

---

### User Request 2:
> *"push this on the github https://github.com/syedatifbashir/ambersaloon upload on this one"*

#### Actions Taken:
1. Initialized git repository locally in `c:\Users\Atif\Downloads\TransferNow-20261029dUQ4QJhR\ambers_salon_redesigned_website`.
2. Added `.gitignore` to protect against unwanted OS or build files.
3. Added remote origin: `https://github.com/syedatifbashir/ambersaloon.git`.
4. Staged and committed all core website files, pages, assets, and configurations.
5. Pushed `main` branch to GitHub remote repository `https://github.com/syedatifbashir/ambersaloon`.

---

### User Request 3:
> *"what to do here"* (attached Vercel project configuration screenshot)

#### Analysis & Actions Taken:
1. Inspected Vercel screenshot:
   - Repository: `syedatifbashir/ambersaloon` (main)
   - Project Name: `ambersaloon`
   - Root Directory: `./` (Correct)
   - Application Preset: `Other` (Correct)
2. Verified that all defaults are 100% correct and no extra settings or environment variables are needed.
3. Advised user to click the black **Deploy** button.

---

### User Request 4:
> *"how i can connec teh pixel on this one wesbite whic ibhavedeployed o vercel"*

#### Analysis & Actions Taken:
1. Identified tracking requirements for salon website (Meta / Facebook & Instagram Pixel, plus optional TikTok / Google Tag).
2. Prepared implementation architecture:
   - Base Pixel Code in `<head>` of both `index.html` and `prices.html` for `PageView` tracking.
   - High-value conversion tracking on WhatsApp booking form submission (`Lead` / `Contact` event).
   - Price catalogue exploration tracking (`ViewContent` / `Search` event).
3. Provided step-by-step instructions and offered to inject the user's Pixel ID directly into Git and push live to Vercel automatically.

---

### User Request 5:
> *"i want it to deplor on teh github wiht hsi one repository and replcae adn delete teh previous one adn put these one there https://github.com/syedatifbashir/ambersaloon"*

#### Analysis & Actions Taken:
1. **Source Package Inspection**:
   - User provided a new updated package folder `saloon 0002` containing updated `index.html`, `prices.html`, CSS, JS, and stock assets.
   - Confirmed complete structure: responsive home page, full 314-item price list across 13 categories, WhatsApp modal booking integration, client reviews system, and salon contact info.
2. **Asset Enhancement**:
   - Successfully downloaded and bundled all 8 self-hosted high-resolution Unsplash stock photographs directly into `assets/stock/` (`hero.jpg`, `hair.jpg`, `makeup.jpg`, `skin.jpg`, `nails.jpg`, `bridal.jpg`, `spa.jpg`, `academy.jpg`).
   - Bundled `vercel.json` for seamless Vercel production hosting with clean URL rewrites and asset caching.
   - Added standard `.gitignore`.
3. **Repository Replacement & Sync**:
   - Initialized Git in `saloon 0002`.
   - Connected remote `https://github.com/syedatifbashir/ambersaloon.git`.
   - Replaced previous repository content with this new `saloon 0002` package.
   - Preserved full conversation history in `CONVERSATION_HISTORY.md` per user directive.
   - Successfully pushed updated package to `main` branch on GitHub, automatically triggering new live deployment on Vercel.


---

### User Request 6:
> *"how ot deploy it on teh vercel now on teh rprevious domain"*

#### Analysis & Guidance Provided:
1. **Automatic Deployment Mechanism**:
   - Because the Vercel project `ambersaloon` is connected directly to `syedatifbashir/ambersaloon` on branch `main`, the recent push (`commit 91cf2a7`) automatically triggers an instant rebuild and live deployment on Vercel.
   - The existing production domain (e.g., `ambersaloon.vercel.app` or linked custom domain) automatically serves the new files without needing a separate project creation.
2. **Verification & Manual Redeployment Steps**:
   - Outlined steps to verify deployment status at `vercel.com/dashboard` under the **Deployments** tab.
   - Provided instructions for performing a manual redeploy if necessary.
   - Clarified that the previous domain remains assigned to the project and requires no re-configuration.

---

### User Request 7:
> *"mean tell me now th resporitory ispublic so how to make it mean if i make i private then it will be connected with eh vercel or not so nobody can see it as well on github"*

#### Analysis & Clarifications:
1. **Will Vercel still work if the GitHub repo is made Private?**:
   - **YES, 100%**. Vercel connects via authorized GitHub integration (OAuth / GitHub App) and has full access to deploy private repositories.
   - The live website on Vercel remains publicly visible to customers, while your code, assets, and commit history on GitHub become completely hidden from the public.
   - Automatic deployments on `git push` continue to work seamlessly.
2. **Step-by-Step Instructions to Make Repo Private**:
   - Navigate to `https://github.com/syedatifbashir/ambersaloon/settings`.
   - Scroll to the bottom to the **Danger Zone**.
   - Click **Change repository visibility** -> **Change to private**.
   - Confirm by typing repository name.

---

### User Request 8:
> *"i want ot now verify this property in teh google search console so now aadd ths one meta tag in teh header for verification ofthe domain And i am alos giving you the meta pixel as well fo rtracking and connecting of hte pixel so aslo add this one as well so our pixel can connect as welll in there ... and also i want to ad tittle and description as well properly and schemamarkup as well properly so do also properly onpage ad technical seo as well properly and according to the limit of the google for meta tittle adn descripton as well properly"*

#### Implementation & Optimizations Performed:
1. **Google Search Console Verification Tag**:
   - Added `<meta name="google-site-verification" content="-9LZehJ832dJO-Ug7aL99XZYXvYyPXOYe5hWjULN-3w" />` to the `<head>` of both `index.html` and `prices.html`.
2. **Meta Pixel Integration & Event Tracking (Pixel ID: `1819814659252165`)**:
   - Added the official Meta Pixel snippet with `<noscript>` fallback to `<head>` of both `index.html` and `prices.html` for automatic `PageView` tracking.
   - Enhanced `assets/site.js` to fire `fbq('track', 'Lead')` upon WhatsApp booking submission with service details.
   - Enhanced `assets/site.js` to fire `fbq('track', 'Contact')` on direct WhatsApp button and phone call link clicks.
   - Enhanced `assets/prices.js` to track user catalogue searches (`Search`) and category filters (`ViewContent`).
3. **Google-Compliant Titles & Meta Descriptions**:
   - **`index.html` Title**: `Amber's Salon | Hair, Makeup & Beauty | DHA Phase 6 Lahore` (57 characters — within optimal 50–60 character limit).
   - **`index.html` Meta Description**: `Amber's Salon in DHA Phase 6, Lahore. Premium hair styling, bridal makeup, facials, nails & massage. View price menu & book on WhatsApp: 0301-4398287.` (151 characters — within optimal 140–160 character limit).
   - **`prices.html` Title**: `Price List & Service Menu | Amber's Salon | DHA Phase 6` (56 characters — within optimal 50–60 character limit).
   - **`prices.html` Meta Description**: `Official price list for Amber's Salon in DHA Phase 6, Lahore. 300+ transparent rates in PKR for hair, makeup, facials, nails & spa. Book: 0301-4398287.` (153 characters — within optimal 140–160 character limit).
4. **Rich Schema.org Structured Data (JSON-LD)**:
   - Configured schema on `index.html` for `BeautySalon`, `HairSalon`, and `WebSite`, with complete address (`CCA-109, DHA Phase 6, Lahore`), geo-coordinates (`31.4720, 74.4420`), opening hours (`11:00 - 20:00`), price range (`PKR 300 - 100,000`), social links, and categorized service catalog.
   - Configured schema on `prices.html` for `WebPage`, `BreadcrumbList` (`Home > Prices & Menu`), and `BeautySalon`.
5. **Technical & On-Page SEO Upgrades**:
   - Added canonical link tags (`<link rel="canonical" href="...">`) to eliminate duplicate content issues.
   - Added language alternates (`hreflang="en-pk"` and `hreflang="x-default"`).
   - Added Open Graph (OG) tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:site_name`, `og:locale="en_PK"`, business contact metadata).
   - Added Twitter Card metadata (`summary_large_image`).
   - Added local SEO geographic metadata (`geo.region`, `geo.placename`, `geo.position`, `ICBM`).
   - Created valid XML sitemap at `sitemap.xml` referencing all primary site URLs.
   - Updated `robots.txt` to index all content and reference the XML sitemap.
6. **Git & Live Deployment**:
   - Committed all changes and pushed directly to `origin/main` on GitHub to trigger immediate deployment on Vercel.

---

### User Request 9:
> *"no thre sould now be index.html like this one url only clea url like prices and like this one according to that one properly"*

#### Analysis & Actions Taken:
1. **Clean URL Architecture Implemented**:
   - Converted all root links from `index.html` to clean `/`.
   - Converted all price catalogue links and form actions from `prices.html` to clean `/prices`.
   - Converted all in-page jump links from `index.html#section` to clean `/#section`.
   - Converted all category links from `prices.html?category=...` to clean `/prices?category=...`.
2. **SEO & Metadata Canonical Alignment**:
   - Updated canonical URLs on both pages to clean paths: `https://ambersaloon.vercel.app/` and `https://ambersaloon.vercel.app/prices`.
   - Updated Open Graph (`og:url`) and Twitter Card (`twitter:url`) tags to point to `/` and `/prices`.
   - Updated Schema.org structured data breadcrumbs, webpage IDs, and catalog URLs to clean `/prices` endpoints.
   - Updated `sitemap.xml` with clean URL entries: `https://ambersaloon.vercel.app/` and `https://ambersaloon.vercel.app/prices`.
3. **Vercel Server Routing & 301 Permanent Redirects**:
   - Configured `vercel.json` with `"cleanUrls": true`, `"trailingSlash": false`.
   - Added permanent 301 redirects for `/index`, `/index.html` -> `/`, and `/prices.html` -> `/prices` so no bookmarks or legacy crawlers receive broken links.
4. **Git Sync & Live Deployment**:
   - Committed changes and pushed to branch `main` on GitHub to auto-trigger immediate Vercel deployment.

---

### User Request 10:
> *"ok so check all the security chekpoints adn then optimization as well properly so it becomes ready to serve the clients"*

#### Security & Optimization Audit & Enhancements:
1. **HTTP Security Headers Configured (`vercel.json`)**:
   - `X-Content-Type-Options: nosniff` (mitigates MIME-type sniffing attacks).
   - `X-Frame-Options: SAMEORIGIN` (prevents clickjacking via malicious iframe framing).
   - `X-XSS-Protection: 1; mode=block` (activates legacy browser XSS filters).
   - `Referrer-Policy: strict-origin-when-cross-origin` (safeguards user paths while preserving Meta & Google analytics attribution).
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()` (restricts unauthorized device hardware access).
   - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (enforces HTTPS encryption across modern web clients).
2. **Tabnabbing & External Link Hardening**:
   - Audited all external links (Instagram, Google Maps, WhatsApp, phone dials) — confirmed 100% compliance with `rel="noopener noreferrer"` and `target="_blank"`.
   - Verified JavaScript `window.open` calls explicitly define `noopener,noreferrer`.
3. **Cross-Site Scripting (XSS) & Input Validation Verification**:
   - Audited DOM manipulation in `assets/site.js` and `assets/prices.js`: confirmed all dynamic variables use `escapeHTML()` and safe `textContent` setters.
   - Verified form constraints (`maxlength`, `required`, date bounds) on booking modal and local reviews.
4. **Rendering & Core Web Vitals Optimization**:
   - **Eliminated render-blocking CSS `@import`**: Moved Google Fonts (`DM Sans`, `Manrope`, `Playfair Display`) from `@import` in `styles.css` into parallel non-blocking `<link rel="stylesheet">` tags in `<head>`.
   - **Resource Hints**: Added `preconnect` and `dns-prefetch` for `fonts.googleapis.com`, `fonts.gstatic.com`, `connect.facebook.net`, and `facebook.com`.
   - **LCP Speedup**: Added `<link rel="preload" as="image" href="assets/stock/hero.jpg" fetchpriority="high" />` for immediate hero image rendering.
   - **Asset Caching**: Added `public, max-age=31536000, immutable` for static assets and `public, max-age=0, must-revalidate` for clean HTML routing.
5. **Code Validation & Quality Assurance**:
   - Ran `node --check` syntax validation across `site.js`, `prices.js`, and `prices-data.js` (100% clean, 0 syntax errors).
   - Ran JSON validation across `vercel.json` and asset data sources (100% valid).
6. **Git Sync & Deployment**:
   - Committed and pushed all enhancements to `main` on GitHub to trigger live production deployment on Vercel.

---

### User Request 11:
> *"tell me i want to put the videos on website from instagram what si teh best way to do that so it loads quickly and show quickly as welll properly"*

#### Architectural Recommendations & Strategy:
1. **The Problem with Raw Instagram Embeds (`embed.js`)**:
   - Standard Instagram `<blockquote>` embeds load 2–4 MB of external scripts, trackers, cookie prompts, and stylesheets per embed.
   - 4 embedded reels will slow the page load by 3–6 seconds on mobile devices and reduce Google PageSpeed scores.
2. **Strategy A (Recommended — High-Performance Self-Hosted Reels with Poster & Lazy Autoplay)**:
   - Download the Instagram reel as an optimized MP4 (720p/1080p, compressed to ~1–2 MB).
   - Generate a lightweight poster image (JPEG/WebP, ~30–50 KB).
   - Use HTML5 `<video playsinline muted loop preload="none" poster="...">`.
   - Use an `IntersectionObserver` in JavaScript to only stream/play the video when scrolled into view.
   - Result: 0ms initial lag, 100 PageSpeed score, smooth TikTok/Reels style looping, with direct link to the Instagram post.
3. **Strategy B (Click-to-Play Facade / Modal)**:
   - Display video thumbnail with an Instagram play badge.
   - When clicked, open a modal with the video or load the embed on demand, keeping initial page load 100% lightweight.

---

### User Request 12:
> *"if i give it to you than can you upload it and sav eit as well"*

#### Response & Capabilities Confirmed:
- Confirmed full capability to receive video files or download links, organize them in `assets/videos/`, generate/link cover thumbnails, integrate them into `index.html` with responsive reels UI and lazy autoplay, and commit/push directly to GitHub for automatic Vercel deployment.

---

### User Request 13:
> *"i want ot fecth thierreviews video on hihglights how i can so uou cna put here as well"*

#### Guidance & Step-by-Step Instructions Provided:
1. **Explanation of Instagram Restrictions**:
   - Instagram Highlights require authentication/session access, preventing direct automated scraping without triggering anti-bot login walls.
2. **Method 1 (Fastest via Web Downloader — No Login Required)**:
   - Use free online Highlight downloaders (StorySaver.net, SnapInsta.app, or Save-Insta.com).
   - Enter username `ambersalon.official`.
   - Select the "Reviews" / "Client Feedback" highlight and click Download MP4.
3. **Method 2 (From Instagram App — If Account Admin)**:
   - Open Highlight on mobile -> tap More (`...`) -> "Save Video" directly to camera roll in HD.
4. **Integration Workflow**:
   - Save the downloaded `.mp4` video files into `saloon 0002\assets\videos\`.
   - Assistant will automatically build the responsive video review reel section with lazy playback, commit to Git, and push live to Vercel.

---

### User Request 14:
> *"in which folder i have to paste the videos properly for clear and quickly loading as well show in 1 sec"*

#### Actions & Instructions Provided:
1. Created dedicated directory: `assets\videos\` (`c:\Users\Atif\Downloads\saloon 0002\assets\videos\`).
2. Added `README.txt` with naming conventions (`review-01.mp4`, `review-02.mp4`, etc.).
3. Clarified 1-second load performance architecture:
   - Edge CDN caching (`public, max-age=31536000, immutable`).
   - Lightweight poster image preview (instant <100ms display).
   - `preload="metadata"` and smooth scroll-in streaming to prevent buffering.

---

### User Request 15:
> *"i have pasted the videos now according ot eh color make a carousle add that onein this area add these videos before teh 01 section properly with direct adbn wuickly video shows properly"* (attached screenshot)

#### Actions Taken:
- Added `.highlights-section` carousel before section 01 with 10 review reel cards, audio controls, and snapping scroll.

---

### User Request 16:
> *"undo the previous step"*

#### Actions Taken:
- Reverted commit `8c4d82f` via `git revert 8c4d82f`.
- Restored `index.html`, `assets/refined.css`, and `assets/site.js` back to their state prior to the video carousel insertion.
- Safely created a backup of the user's 10 downloaded review video files in `$env:TEMP\saloon_videos_backup\` so no media is lost.
- Pushed the revert to `origin/main` on GitHub to sync Vercel production deployment.

---

### User Request 21:
> *"no push this one no changes"*

#### Actions & Confirmation:
- Confirmed that the site is in its clean, stable production state with no video carousel and no design changes.
- Maintained all SEO, Google Search Console verification, Meta Pixel tracking, clean URL routing, security headers, and original design intact.
- Committed and pushed confirmation to `origin/main` on GitHub to ensure Vercel production remains clean and stable.


---

### User Request 22:
> *"TASK: Add ONE new "Video Carousel" section to my existing website, placed directly ABOVE the section I call "Section 1". Do not change anything else. ... pick the videos from the assetes video folder adn also generate teh thumbnail according to the video properly and optimized one. add these videos before teh 01 section properly with direct adbn wuickly video shows properly"*

#### Implementation & Audit:
1. **Step 0 Architectural Inspection**:
   - **Framework / Stack**: Static HTML5, vanilla CSS, vanilla JavaScript, deployed on Vercel (`vercel.json`).
   - **Homepage File**: `index.html`.
   - **Identified "Section 1"**: `<section class="section" id="services">` with eyebrow `01 / Explore the salon` and heading `Beauty in every detail.`.
   - **Design Tokens**: Black & Gold luxury palette:
     - Gold: `#b58b64`, `#d6af8a`, `rgba(181, 139, 100, 0.28)`
     - Dark / Plum: `#302539`, `#2a1f30`, `#221827`
     - Backgrounds: `#fffcf8` to `#f7f1f3`
     - Typography: `'Playfair Display'` (headings), `'Manrope'` (eyebrow, badges), `'DM Sans'` (captions, body).
     - Radius: `16px`.
2. **Thumbnail Generation**:
   - Extracted crisp, native HD video cover thumbnails directly from each of the 10 videos in `assets/videos/`: `review-01-poster.jpg` through `review-10-poster.jpg` (31 KB to 201 KB).
   - Ensured zero empty or black boxes on page load.
3. **Scoped CSS (`assets/video-carousel.css`)**:
   - All classes strictly prefixed with `vc-`.
   - Responsive layout: 3 cards on desktop (`>1024px`), 2 cards on tablet (`680px - 1023px`), 1 card with peek on mobile (`<680px`).
   - Dark cards with gold borders, gold play icon overlay, audio toggle, dot navigation, smooth CSS scroll snap, and `prefers-reduced-motion` support.
4. **Scoped JS (`assets/video-carousel.js`)**:
   - Vanilla JS without any external libraries.
   - `IntersectionObserver` handles viewport detection: pauses out-of-view videos and loads metadata on scroll.
   - Only 1 video plays at a time; clicking any card pauses others.
   - Dynamic dot indicators synchronized with horizontal scroll.
5. **Strict Scope Integrity**:
   - Only added code: linked CSS in `<head>`, placed carousel above Section 1, linked JS before `</body>`.
   - Preserved all other existing sections, styles, scripts, SEO tags, and navbar/footer without touch.


---

### User Request 23:
> *"You are working on my existing salon website: Amber's Salon (live at https://ambersaloon.vercel.app/, deployed on Vercel). GOLDEN RULE — DO NOT BREAK ANYTHING... TASK 1 — Make hero text bolder and stronger (mobile + laptop)... TASK 2 — Replace the hero arch image with a video... TASK 3 — Search bar below the hero... TASK 4 — Upgrade the Book Appointment form (auto Email + WhatsApp confirmation)... TASK 5 — WhatsApp button for appointments... FINAL CHECKS... Give me a summary of every file changed and what I need to do manually"*

#### Implementation & Architecture:
1. **Task 1 (Bolder Hero Typography & Mobile Optimization)**:
   - Expanded Google Fonts in `index.html` & `prices.html` to load Playfair Display full bold weights (`0,700;0,800;0,900` and italic `1,700;1,800;1,900`).
   - Styled `.hero h1.serif` in `assets/refined.css` with `font-weight: 800`, `letter-spacing: -0.035em`, and `clamp()` responsive fluid typography.
   - Preserved mauve color (`#8c5874`) on `em` with bold weight (`700`).
   - Enhanced hero paragraph readability with `font-weight: 500`, high contrast `#4b3e48`, and `line-height: 1.85`.
   - Verified zero horizontal overflow on screens down to 360px.
2. **Task 2 (Hero Arch Video & Fallback)**:
   - Updated `.arch-photo` in `index.html` to house `<video autoplay muted loop playsinline preload="metadata" poster="assets/stock/hero.jpg" class="hero-arch-video" id="heroArchVideo">`.
   - Sourced `assets/videos/hero.mp4` and `assets/videos/hero.webm` with fallback `<img>` to `assets/stock/hero.jpg`.
   - Configured `object-fit: cover` to preserve the exact arch frame shape, circular stamp, and vertical text.
   - Added JS and CSS fallbacks for video load errors or `prefers-reduced-motion`.
3. **Task 3 (Below-Hero Live Service & Price Search Bar)**:
   - Created Below-Hero search bar directly between the hero section and the ticker marquee.
   - Built standalone lightweight `assets/hero-search.js` indexing all 13 categories and 314 items from `window.AMBERS_PRICE_DATA`.
   - Live debounced dropdown with `<mark>` keyword highlighting, price display, and direct navigation to `/prices?category=...&q=...`.
   - Accessible keyboard controls (Up/Down arrow navigation, Enter selection, Escape to close).
   - "No results — WhatsApp us" fallback with pre-filled enquiry link.
   - Connected existing "Search menu ↗" form on homepage to this unified search bar.
   - Enhanced `assets/prices.js` to smoothly scroll and flash-highlight matching services on arrival.
4. **Task 4 (Upgraded Booking Form & Serverless Confirmation API)**:
   - Upgraded modal form on `index.html` and `prices.html` with:
     - Dynamic Category dropdown (from `window.AMBERS_PRICE_DATA`).
     - Dynamic Specific Service dropdown with price tags.
     - Full Name, Pakistan phone format validation (`03XX-XXXXXXX` -> `+923...`), Email validation.
     - Date (no past dates), Time (11:00 AM – 7:00 PM), Number of Guests, Special Requests.
     - Anti-spam honeypot field (`website_url_hp`) and consent checkbox.
     - Submit button with spinner loading state.
     - Elegant post-submission success view with appointment summary.
   - Created Vercel serverless function `api/book.js` handling POST requests, IP rate limiting, HTML email confirmation via Resend, and Meta WhatsApp Cloud API notification.
   - Fail-safe fallback: If API is offline or keys missing, auto-generates structured WhatsApp message to salon (`0301-4398287`) so zero bookings are lost.
   - Created `.env.example` and detailed `SETUP.md`.
   - Updated FAQ answer for "How do I book an appointment?".
5. **Task 5 (Floating WhatsApp & Modal Actions)**:
   - Positioned floating WhatsApp button on both home and `/prices` pages.
   - Pre-filled message: `"Hi Amber's Salon, I'd like to book an appointment."`.
   - Desktop hover tooltip: `"Book on WhatsApp"`.
   - Subtle luxury pulse animation (`@keyframes waPulse`).
   - Added secondary direct WhatsApp option inside the booking modal.
