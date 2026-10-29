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
  let lastFocus = null;
  const bookingModal = q('#bookingModal');
  const serviceField = q('#bService'); const closeModal = q('#closeModal');
  const bookingDate = q('#bDate');
  if (bookingDate) {
    const d = new Date(), year=d.getFullYear(), mo=String(d.getMonth()+1).padStart(2,'0'), day=String(d.getDate()).padStart(2,'0');
    bookingDate.min = `${year}-${mo}-${day}`;
  }
  function openBooking(service) {
    if (!bookingModal) return;
    lastFocus = document.activeElement;
    bookingModal.hidden = false;
    if (serviceField) serviceField.value = service || 'General appointment';
    document.body.style.overflow = 'hidden';
    q('#bName')?.focus();
  }
  function closeBooking() {
    if (!bookingModal) return;
    bookingModal.hidden = true;document.body.style.overflow = '';
    if (lastFocus?.focus) lastFocus.focus();
  }
  document.addEventListener('click', ev => {
    const trigger = ev.target.closest('[data-book]');
    if (trigger) {ev.preventDefault();openBooking(trigger.dataset.service || 'General appointment');}
  });
  closeModal?.addEventListener('click', closeBooking);
  bookingModal?.addEventListener('click', e => {if(e.target===bookingModal)closeBooking()});
  document.addEventListener('keydown', e => {if(e.key==='Escape')closeBooking()});
  q('#bookingForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const name=q('#bName').value.trim(), service=q('#bService').value.trim(), date=q('#bDate').value, time=q('#bTime').value, note=q('#bNote').value.trim();
    if (!name || !service || !date || !time) return;
    const message = `Hello Amber's Salon, I'd like to request an appointment.\n\nName: ${name}\nService: ${service}\nPreferred date: ${date}\nPreferred time: ${time}${note ? `\nNotes: ${note}`:''}\n\nPlease confirm availability and the final price. Thank you.`;
    window.open(`${WA}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    closeBooking();
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
