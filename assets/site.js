'use strict';
(() => {
  const WA = 'https://wa.me/923014398287';
  const q = s => document.querySelector(s);
  const qa = s => [...document.querySelectorAll(s)];
  const page = document.body.dataset.page;
  const current = q(`[data-page="${page}"]`);
  if (current) current.setAttribute('aria-current', 'page');
  const year = q('#year'); if (year) year.textContent = new Date().getFullYear();

  // Stock photos are loaded from the self-hosted assets/stock directory first.
  // If local photos have not been downloaded, use official Unsplash photo URLs.
  // If the viewer is offline, bundled SVG illustrations remain available.
  const sources = {
    hero:'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=85',
    hair:'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1100&q=82',
    makeup:'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1100&q=82',
    skin:'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1100&q=82',
    nails:'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1100&q=82',
    bridal:'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1100&q=82',
    spa:'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1100&q=82',
    academy:'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=1100&q=82'
  };
  qa('img[data-photo]').forEach(img => {
    let phase = 0;
    const name = img.dataset.photo || 'hero';
    img.addEventListener('error', () => {
      phase++;
      if (phase === 1 && sources[name]) img.src = sources[name];
      else if (phase === 2) img.src = `assets/stock/${name}.svg`;
      else img.onerror = null;
    });
  });

  // Navigation (works with both keyboard and touch).
  const nav = q('#mainnav'); const navButton = q('#mobileToggle');
  if (nav && navButton) {
    navButton.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      navButton.setAttribute('aria-expanded', String(open));
      navButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      navButton.textContent = open ? '×' : '☰';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open'); navButton.setAttribute('aria-expanded','false'); navButton.textContent = '☰';
    }));
    document.addEventListener('click', ev => {
      if (!nav.contains(ev.target) && !navButton.contains(ev.target)) {
        nav.classList.remove('open');navButton.setAttribute('aria-expanded','false');navButton.textContent='☰';
      }
    });
  }

  // Hero arch video graceful fallback
  const heroVideo = q('#heroArchVideo');
  if (heroVideo) {
    heroVideo.addEventListener('error', () => {
      heroVideo.classList.add('video-fallback');
    });
  }

  // Upgraded Booking System (Email + WhatsApp Multi-channel confirmation)
  let lastFocus = null;
  const bookingModal = q('#bookingModal');
  const closeModal = q('#closeModal');
  const bookingFormContainer = q('#bookingFormContainer');
  const bookingSuccessContainer = q('#bookingSuccessContainer');
  const bookingAlert = q('#bookingAlert');
  const submitBtn = q('#bSubmitBtn');
  const successCloseBtn = q('#successCloseBtn');
  const categorySelect = q('#bCategory');
  const serviceSelect = q('#bService');
  const phoneInput = q('#bPhone');
  const bookingDate = q('#bDate');

  if (bookingDate) {
    const d = new Date(), year = d.getFullYear(), mo = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
    bookingDate.min = `${year}-${mo}-${day}`;
  }

  // Format Pakistan mobile number as user types: 03XX-XXXXXXX
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      let val = phoneInput.value.replace(/[^\d+]/g, '');
      if (val.startsWith('+92')) {
        val = '0' + val.slice(3);
      } else if (val.startsWith('92')) {
        val = '0' + val.slice(2);
      }
      if (val.length > 4 && !val.includes('-')) {
        phoneInput.value = val.slice(0, 4) + '-' + val.slice(4, 11);
      }
    });
  }

  const readable = text => String(text || '').toLowerCase().replace(/(^|\s|[&/-])\S/g, c => c.toUpperCase());

  // Populate Categories & Services from window.AMBERS_PRICE_DATA
  function populateCategories() {
    if (!categorySelect || categorySelect.options.length > 1) return;
    const data = window.AMBERS_PRICE_DATA;
    if (!data || !Array.isArray(data.sections)) return;

    data.sections.forEach(sec => {
      const opt = document.createElement('option');
      opt.value = sec.name;
      opt.textContent = readable(sec.name);
      categorySelect.appendChild(opt);
    });
  }

  function populateServicesForCategory(categoryName, selectedServiceText) {
    if (!serviceSelect) return;
    serviceSelect.innerHTML = '<option value="">Choose service &amp; price…</option>';
    const data = window.AMBERS_PRICE_DATA;
    if (!data || !Array.isArray(data.sections)) return;

    const section = data.sections.find(s => s.name === categoryName);
    if (!section || !Array.isArray(section.groups)) return;

    let matched = false;
    section.groups.forEach(group => {
      const isGen = group.name === 'General' || !group.name;
      const grpLabel = isGen ? readable(section.name) : group.name;
      if (Array.isArray(group.items)) {
        group.items.forEach(item => {
          const opt = document.createElement('option');
          const fullLabel = `${grpLabel} — ${item.name} (PKR ${item.price})`;
          opt.value = fullLabel;
          opt.textContent = fullLabel;
          if (selectedServiceText && fullLabel.toLowerCase().includes(selectedServiceText.toLowerCase())) {
            opt.selected = true;
            matched = true;
          }
          serviceSelect.appendChild(opt);
        });
      }
    });

    if (selectedServiceText && !matched) {
      const customOpt = document.createElement('option');
      customOpt.value = selectedServiceText;
      customOpt.textContent = `${selectedServiceText} (Selected)`;
      customOpt.selected = true;
      serviceSelect.appendChild(customOpt);
    }
  }

  categorySelect?.addEventListener('change', () => {
    populateServicesForCategory(categorySelect.value);
  });

  function openBooking(initialService) {
    if (!bookingModal) return;
    lastFocus = document.activeElement;
    bookingModal.hidden = false;
    document.body.style.overflow = 'hidden';

    // Reset view
    if (bookingFormContainer) bookingFormContainer.hidden = false;
    if (bookingSuccessContainer) bookingSuccessContainer.hidden = true;
    if (bookingAlert) { bookingAlert.hidden = true; bookingAlert.textContent = ''; }

    populateCategories();

    if (initialService && initialService !== 'General appointment') {
      const data = window.AMBERS_PRICE_DATA;
      let matchedSec = null;
      if (data && Array.isArray(data.sections)) {
        for (const sec of data.sections) {
          if (sec.groups.some(g => g.items.some(i => initialService.toLowerCase().includes(i.name.toLowerCase())))) {
            matchedSec = sec.name;
            break;
          }
        }
      }
      if (matchedSec && categorySelect) {
        categorySelect.value = matchedSec;
        populateServicesForCategory(matchedSec, initialService);
      } else {
        if (serviceSelect) {
          serviceSelect.innerHTML = `<option value="${initialService}" selected>${initialService}</option>`;
        }
      }
    } else {
      if (categorySelect && categorySelect.options.length > 1) {
        categorySelect.selectedIndex = 1;
        populateServicesForCategory(categorySelect.value);
      }
    }

    q('#bName')?.focus();
  }

  function closeBooking() {
    if (!bookingModal) return;
    bookingModal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus?.focus) lastFocus.focus();
  }

  document.addEventListener('click', ev => {
    const trigger = ev.target.closest('[data-book]');
    if (trigger) {
      ev.preventDefault();
      openBooking(trigger.dataset.service || 'General appointment');
    }
  });

  closeModal?.addEventListener('click', closeBooking);
  successCloseBtn?.addEventListener('click', closeBooking);
  bookingModal?.addEventListener('click', e => { if (e.target === bookingModal) closeBooking(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !bookingModal.hidden) closeBooking(); });

  // Booking Form Submission Handler
  q('#bookingForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const hp = q('#bWebsiteHp')?.value;
    if (hp) {
      // Spam honeypot detected
      closeBooking();
      return;
    }

    const name = q('#bName')?.value.trim();
    const phone = q('#bPhone')?.value.trim();
    const email = q('#bEmail')?.value.trim();
    const category = q('#bCategory')?.value;
    const service = q('#bService')?.value;
    const date = q('#bDate')?.value;
    const time = q('#bTime')?.value;
    const guests = q('#bGuests')?.value || '1';
    const note = q('#bNote')?.value.trim() || '';
    const consent = q('#bConsent')?.checked;

    // Validation
    if (!name || !phone || !email || !service || !date || !time) {
      if (bookingAlert) {
        bookingAlert.textContent = 'Please fill in all required fields marked with *';
        bookingAlert.hidden = false;
      }
      return;
    }

    // Pakistan phone validation regex
    const phoneClean = phone.replace(/[\s-]/g, '');
    const pkPhoneRegex = /^(\+92|0092|92|0)?3[0-9]{9}$/;
    if (!pkPhoneRegex.test(phoneClean)) {
      if (bookingAlert) {
        bookingAlert.textContent = 'Please enter a valid Pakistan mobile number (e.g. 0301-4398287).';
        bookingAlert.hidden = false;
      }
      q('#bPhone')?.focus();
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      if (bookingAlert) {
        bookingAlert.textContent = 'Please enter a valid email address for your confirmation.';
        bookingAlert.hidden = false;
      }
      q('#bEmail')?.focus();
      return;
    }

    if (!consent) {
      if (bookingAlert) {
        bookingAlert.textContent = 'Please agree to receive booking updates to proceed.';
        bookingAlert.hidden = false;
      }
      return;
    }

    // Prepare payload
    const payload = {
      name,
      phone,
      email,
      category,
      service,
      date,
      time,
      guests,
      note,
      consent: true,
      timestamp: new Date().toISOString()
    };

    // UI Loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      const textSpan = submitBtn.querySelector('.btn-text');
      const spinSpan = submitBtn.querySelector('.btn-spinner');
      if (textSpan) textSpan.hidden = true;
      if (spinSpan) spinSpan.hidden = false;
    }
    if (bookingAlert) bookingAlert.hidden = true;

    // Meta Pixel Lead tracking
    if (typeof window.fbq === 'function') {
      try {
        window.fbq('track', 'Lead', {
          content_name: service,
          content_category: category || 'Salon Appointment',
          currency: 'PKR'
        });
      } catch (_) {}
    }

    // WhatsApp fallback message generator
    const fallbackWaMsg = `Hello Amber's Salon, I'd like to book an appointment.\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nCategory: ${category || 'General'}\nService: ${service}\nPreferred Date: ${date}\nPreferred Time: ${time}\nGuests: ${guests}${note ? `\nNotes: ${note}` : ''}\n\nPlease confirm availability. Thank you.`;
    const fallbackWaUrl = `${WA}?text=${encodeURIComponent(fallbackWaMsg)}`;

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await response.json().catch(() => ({}));

      if (response.ok && resData.success !== false) {
        // Show success state
        if (bookingFormContainer) bookingFormContainer.hidden = true;
        if (bookingSuccessContainer) {
          bookingSuccessContainer.hidden = false;
          const sName = q('#successName'); if (sName) sName.textContent = name;
          const sEmail = q('#successEmail'); if (sEmail) sEmail.textContent = email;
          const sService = q('#successService'); if (sService) sService.textContent = service;
          const sDateTime = q('#successDateTime'); if (sDateTime) sDateTime.textContent = `${date} at ${time}`;
          const sWaBtn = q('#successWaBtn');
          if (sWaBtn) sWaBtn.href = resData.fallbackWhatsAppUrl || fallbackWaUrl;
        }
      } else {
        // Fallback gracefully so no booking is lost
        showBookingFallback(resData.error || 'Server is synchronizing. You can complete your booking instantly via WhatsApp.', fallbackWaUrl);
      }
    } catch (err) {
      // Network or offline fallback
      showBookingFallback('Network connection interrupted. Click below to confirm directly via WhatsApp.', fallbackWaUrl);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        const textSpan = submitBtn.querySelector('.btn-text');
        const spinSpan = submitBtn.querySelector('.btn-spinner');
        if (textSpan) textSpan.hidden = false;
        if (spinSpan) spinSpan.hidden = true;
      }
    }
  });

  function showBookingFallback(msg, waUrl) {
    if (!bookingAlert) return;
    bookingAlert.innerHTML = `
      <p style="margin:0 0 8px;"><strong>${msg}</strong></p>
      <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn dark" style="display:inline-block;padding:9px 16px;font-size:12px;">Continue to WhatsApp Confirmation ↗</a>
    `;
    bookingAlert.hidden = false;
  }

  // Track Meta Pixel events for direct contact actions (WhatsApp & Phone calls)
  document.addEventListener('click', ev => {
    const wa = ev.target.closest('a[href*="wa.me"]');
    if (wa && typeof window.fbq === 'function') {
      try { window.fbq('track', 'Contact', { content_name: 'WhatsApp Appointment' }); } catch (err) {}
    }
    const tel = ev.target.closest('a[href^="tel:"]');
    if (tel && typeof window.fbq === 'function') {
      try { window.fbq('track', 'Contact', { content_name: 'Phone Call' }); } catch (err) {}
    }
  });

  // Share this site. On file://, most browsers disallow clipboard, so show guidance.
  let toastTimeout;
  function toast(text) {
    const el=q('#shareToast');if(!el)return;
    clearTimeout(toastTimeout);el.textContent=text;el.hidden=false;
    toastTimeout=setTimeout(()=>{el.hidden=true},3800);
  }
  q('#shareBtn')?.addEventListener('click',async()=>{
    try {
      if(navigator.share) await navigator.share({title:"Amber's Salon",url:location.href});
      else if(navigator.clipboard) {await navigator.clipboard.writeText(location.href);toast('Website link copied.');}
      else toast('Share this page from your browser address bar.');
    } catch(err) {if(err.name!=='AbortError')toast('Copy the website address from your address bar to share it.');}
  });

  // Honesty-first review demo: no fabricated reviews and no false public posting.
  let rating=0;
  const stars=qa('.star');
  function updateStars(){stars.forEach(b=>{let on=Number(b.dataset.rating)<=rating;b.classList.toggle('is-on',on);b.setAttribute('aria-pressed',String(on));});}
  stars.forEach(b=>b.addEventListener('click',()=>{rating=Number(b.dataset.rating);updateStars()}));
  const key='ambers-salon-local-reviews-v1';
  let entries=[];
  try{entries=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(entries))entries=[];}catch{entries=[];}
  function reviewElt(x){
    const c=document.createElement('article');c.className='review-card';
    const star=document.createElement('div');star.textContent='★'.repeat(x.rating)+'☆'.repeat(5-x.rating);star.style.color='#b88e72';
    const p=document.createElement('p');p.textContent=x.text;
    const sm=document.createElement('small');sm.textContent=`${x.name} · Preview saved on this device`;
    c.append(star,p,sm);return c;
  }
  function renderReviews(){
    const dest=q('#reviewList');if(!dest)return;dest.replaceChildren();
    if(!entries.length){const el=document.createElement('div');el.className='review-card';el.innerHTML='<p>No customer reviews have been added on this device yet.</p><small>Only authentic submitted reviews will appear here as local previews.</small>';dest.append(el);return;}
    entries.slice(-4).reverse().forEach(x=>dest.append(reviewElt(x)));
  }
  renderReviews();
  q('#reviewForm')?.addEventListener('submit', e=>{
    e.preventDefault();const name=q('#reviewName').value.trim();const text=q('#reviewText').value.trim();
    const alert=q('#reviewAlert');
    if(!rating){alert.textContent='Please choose a star rating.';return;}
    if(name.length<1 || text.length<15){alert.textContent='Please enter your name and a review of at least 15 characters.';return;}
    entries.push({name:name.substring(0,50),text:text.substring(0,600),rating});
    try{localStorage.setItem(key,JSON.stringify(entries.slice(-20)));}catch{}
    renderReviews();alert.textContent='Your review is visible on this device only. To send it to the salon, use the WhatsApp link below.';
    const payload=`Hello Amber's Salon, here is my feedback:\n${'★'.repeat(rating)}\n${text}\n— ${name}`;
    const waReview=q('#sendReviewWa');if(waReview)waReview.href=WA+'?text='+encodeURIComponent(payload);
    e.target.reset();rating=0;updateStars();
  });
})();
