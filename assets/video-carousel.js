/**
 * Video Carousel Controller (Vanilla JS)
 * Scoped specifically to #video-carousel and .vc-* elements
 */
'use strict';
(() => {
  const root = document.getElementById('video-carousel');
  if (!root) return;

  const track = root.querySelector('.vc-track');
  const cards = [...root.querySelectorAll('.vc-card')];
  const prevBtn = root.querySelector('#vcPrev');
  const nextBtn = root.querySelector('#vcNext');
  const dotsContainer = root.querySelector('#vcDots');

  if (!track || !cards.length) return;

  // Create dot indicators dynamically
  let dots = [];
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    cards.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `vc-dot ${idx === 0 ? 'vc-active' : ''}`;
      dot.setAttribute('aria-label', `Go to video slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      });
      dotsContainer.appendChild(dot);
      dots.push(dot);
    });
  }

  function pauseAllExcept(targetVideo) {
    cards.forEach(card => {
      const v = card.querySelector('video');
      if (v && v !== targetVideo && !v.paused) {
        v.pause();
        card.classList.remove('vc-playing');
      }
    });
  }

  // Setup cards & videos
  cards.forEach((card, idx) => {
    const video = card.querySelector('video');
    const muteBtn = card.querySelector('.vc-mute-btn');
    if (!video) return;

    // Error handling: keep poster visible if video fails
    video.addEventListener('error', () => {
      card.classList.remove('vc-playing');
    });

    // Toggle Play/Pause on card click
    card.addEventListener('click', e => {
      if (e.target.closest('.vc-mute-btn') || e.target.closest('.vc-badge-top')) return;
      if (video.paused) {
        pauseAllExcept(video);
        if (video.preload === 'none') {
          video.preload = 'metadata';
          video.load();
        }
        video.play().then(() => {
          card.classList.add('vc-playing');
        }).catch(() => {});
      } else {
        video.pause();
        card.classList.remove('vc-playing');
      }
    });

    // Keyboard support (Enter/Space on focused card)
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });

    // Sound toggle (Mute / Unmute)
    muteBtn?.addEventListener('click', e => {
      e.stopPropagation();
      video.muted = !video.muted;
      muteBtn.textContent = video.muted ? '🔇' : '🔊';
      muteBtn.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');

      if (!video.muted && video.paused) {
        pauseAllExcept(video);
        if (video.preload === 'none') {
          video.preload = 'metadata';
          video.load();
        }
        video.play().then(() => card.classList.add('vc-playing')).catch(() => {});
      }
    });

    video.addEventListener('ended', () => {
      card.classList.remove('vc-playing');
    });
  });

  // Arrow Navigation
  function getStep() {
    const card = cards[0];
    if (!card) return 300;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.gap) || 22;
    return card.offsetWidth + gap;
  }

  prevBtn?.addEventListener('click', () => {
    track.scrollBy({ left: -getStep(), behavior: 'smooth' });
  });

  nextBtn?.addEventListener('click', () => {
    track.scrollBy({ left: getStep(), behavior: 'smooth' });
  });

  // Update dots and arrow disabled state on scroll
  function updateScrollState() {
    const scrollLeft = track.scrollLeft;
    const maxScroll = track.scrollWidth - track.clientWidth;

    if (prevBtn) prevBtn.disabled = scrollLeft <= 10;
    if (nextBtn) nextBtn.disabled = scrollLeft >= maxScroll - 10;

    if (dots.length) {
      const step = getStep();
      const activeIdx = Math.min(cards.length - 1, Math.max(0, Math.round(scrollLeft / step)));
      dots.forEach((dot, i) => {
        const isActive = i === activeIdx;
        dot.classList.toggle('vc-active', isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    }
  }

  let scrollThrottle;
  track.addEventListener('scroll', () => {
    if (!scrollThrottle) {
      scrollThrottle = requestAnimationFrame(() => {
        updateScrollState();
        scrollThrottle = null;
      });
    }
  }, { passive: true });

  updateScrollState();

  // IntersectionObserver: Load and play when in view, pause when out of view
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const card = entry.target;
        const video = card.querySelector('video');
        if (!video) return;

        if (!entry.isIntersecting) {
          if (!video.paused) {
            video.pause();
            card.classList.remove('vc-playing');
          }
        } else {
          // In view: prepare metadata if not already
          if (video.preload === 'none') {
            video.preload = 'metadata';
          }
        }
      });
    }, { threshold: 0.25 });

    cards.forEach(card => io.observe(card));
  }
})();

