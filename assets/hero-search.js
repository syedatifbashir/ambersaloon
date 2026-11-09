/**
 * Amber's Salon — Below-Hero Live Service & Price Search Controller
 * Pure Vanilla JS, accessible keyboard navigation, debounced matching
 * Reuses window.AMBERS_PRICE_DATA across all 13 categories and 314 options
 */
'use strict';
(() => {
  const WA_NUMBER = '923014398287';

  function initHeroSearch() {
    const input = document.getElementById('heroSearchInput');
    const resultsContainer = document.getElementById('heroSearchResults');
    const clearBtn = document.getElementById('heroSearchClear');
    const browseAllBtn = document.getElementById('heroSearchBrowseAll');
    const quickTags = document.querySelectorAll('.quick-tag');

    if (!input || !resultsContainer) return;

    let itemsIndex = [];
    let selectedIndex = -1;
    let debounceTimer = null;

    // Normalization helper
    const normalize = str => String(str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    const escapeHTML = str => String(str || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const readable = text => text.toLowerCase().replace(/(^|\s|[&/-])\S/g, c => c.toUpperCase());

    // Build search index from window.AMBERS_PRICE_DATA
    function buildIndex() {
      const data = window.AMBERS_PRICE_DATA;
      if (!data || !Array.isArray(data.sections)) return;

      const flat = [];
      data.sections.forEach((section, sIdx) => {
        const secName = section.name || '';
        const secReadable = readable(secName);
        if (Array.isArray(section.groups)) {
          section.groups.forEach(group => {
            const grpName = group.name || '';
            const isGeneral = grpName.toLowerCase() === 'general' || grpName === '';
            const displayGroup = isGeneral ? secReadable : grpName;

            if (Array.isArray(group.items)) {
              group.items.forEach(item => {
                const fullName = isGeneral ? item.name : `${displayGroup} — ${item.name}`;
                const searchStr = `${secName} ${grpName} ${item.name} ${item.price} ${item.note || ''}`;
                flat.push({
                  category: secName,
                  categoryReadable: secReadable,
                  categoryIndex: sIdx,
                  group: displayGroup,
                  name: item.name,
                  fullName: fullName,
                  price: item.price,
                  note: item.note || '',
                  searchBlob: normalize(searchStr)
                });
              });
            }
          });
        }
      });
      itemsIndex = flat;
    }

    buildIndex();
    if (!itemsIndex.length) {
      window.addEventListener('load', buildIndex);
    }

    function highlightMatch(text, query) {
      if (!query) return escapeHTML(text);
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
      return parts.map(part => {
        if (normalize(part) === normalize(query)) {
          return `<mark class="hero-search-mark">${escapeHTML(part)}</mark>`;
        }
        return escapeHTML(part);
      }).join('');
    }

    function renderResults(matches, query) {
      if (!matches.length) {
        const waText = encodeURIComponent(`Hi Amber's Salon, I'm looking for "${query}" on your price menu. Could you please share the details and pricing?`);
        const waUrl = `https://wa.me/${WA_NUMBER}?text=${waText}`;

        resultsContainer.innerHTML = `
          <div class="hero-search-empty">
            <span class="empty-icon">✳</span>
            <div class="empty-text">
              <h4>No matching services found for "<em>${escapeHTML(query)}</em>"</h4>
              <p>Explore all 314 services on our full menu or ask our salon concierge directly.</p>
            </div>
            <div class="empty-actions">
              <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn dark search-wa-btn">WhatsApp Us for Custom Booking ↗</a>
              <a href="/prices" class="btn outline search-all-btn">Browse Full Price List ↗</a>
            </div>
          </div>
        `;
        resultsContainer.hidden = false;
        input.setAttribute('aria-expanded', 'true');
        selectedIndex = -1;
        return;
      }

      const rows = matches.map((item, idx) => {
        const targetUrl = `/prices?category=${encodeURIComponent(item.category)}&q=${encodeURIComponent(item.name)}#catalog`;
        return `
          <a href="${targetUrl}" class="hero-search-item" data-index="${idx}" role="option" aria-selected="false">
            <div class="item-meta">
              <span class="item-category">${escapeHTML(item.categoryReadable)}</span>
              <h4 class="item-title">${highlightMatch(item.fullName, query)}</h4>
              ${item.note ? `<p class="item-note">${escapeHTML(item.note)}</p>` : ''}
            </div>
            <div class="item-price-col">
              <span class="item-price"><small>PKR</small> <strong>${escapeHTML(item.price)}</strong></span>
              <span class="item-arrow" aria-hidden="true">↗</span>
            </div>
          </a>
        `;
      }).join('');

      resultsContainer.innerHTML = `
        <div class="hero-search-list-head">
          <span>Found ${matches.length} match${matches.length === 1 ? '' : 'es'} in price menu</span>
          <a href="/prices?q=${encodeURIComponent(query)}" class="view-all-link">View all on Prices page ↗</a>
        </div>
        <div class="hero-search-list">${rows}</div>
      `;

      resultsContainer.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      selectedIndex = -1;
    }

    function doSearch() {
      const raw = input.value.trim();
      const query = normalize(raw);

      if (clearBtn) clearBtn.hidden = !raw;
      if (browseAllBtn) {
        browseAllBtn.href = raw ? `/prices?q=${encodeURIComponent(raw)}` : '/prices';
      }

      if (!query || query.length < 2) {
        resultsContainer.hidden = true;
        resultsContainer.innerHTML = '';
        input.setAttribute('aria-expanded', 'false');
        selectedIndex = -1;
        return;
      }

      if (!itemsIndex.length) buildIndex();

      const terms = query.split(/\s+/).filter(Boolean);
      const matches = itemsIndex.filter(item => {
        return terms.every(t => item.searchBlob.includes(t));
      }).slice(0, 10);

      renderResults(matches, raw);

      // Meta Pixel Search event
      if (typeof window.fbq === 'function' && raw.length >= 3) {
        try {
          window.fbq('track', 'Search', { search_string: raw });
        } catch (_) {}
      }
    }

    // Input events
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(doSearch, 130);
    });

    input.addEventListener('focus', () => {
      if (input.value.trim().length >= 2) {
        doSearch();
      }
    });

    // Keyboard navigation
    input.addEventListener('keydown', e => {
      const items = resultsContainer.querySelectorAll('.hero-search-item');
      if (!items.length || resultsContainer.hidden) {
        if (e.key === 'Escape') {
          resultsContainer.hidden = true;
          input.setAttribute('aria-expanded', 'false');
        }
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % items.length;
        updateSelection(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        updateSelection(items);
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && items[selectedIndex]) {
          e.preventDefault();
          items[selectedIndex].click();
        } else if (input.value.trim()) {
          // If no item highlighted, navigate to prices page with query
          e.preventDefault();
          location.href = `/prices?q=${encodeURIComponent(input.value.trim())}`;
        }
      } else if (e.key === 'Escape') {
        resultsContainer.hidden = true;
        input.setAttribute('aria-expanded', 'false');
        input.blur();
      }
    });

    function updateSelection(items) {
      items.forEach((item, idx) => {
        const isSel = idx === selectedIndex;
        item.classList.toggle('is-focused', isSel);
        item.setAttribute('aria-selected', String(isSel));
        if (isSel) {
          item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      });
    }

    // Clear button
    clearBtn?.addEventListener('click', () => {
      input.value = '';
      clearBtn.hidden = true;
      resultsContainer.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      input.focus();
    });

    // Quick suggestions chips
    quickTags.forEach(tag => {
      tag.addEventListener('click', () => {
        const text = tag.dataset.tag || tag.textContent.trim();
        input.value = text;
        input.focus();
        doSearch();
      });
    });

    // Dismiss on click outside
    document.addEventListener('click', e => {
      const card = e.target.closest('.hero-search-card');
      if (!card && !resultsContainer.hidden) {
        resultsContainer.hidden = true;
        input.setAttribute('aria-expanded', 'false');
      }
    });

    // Connect existing "Looking for something specific? Search menu ↗" form on homepage
    const homeForm = document.querySelector('.home-price-search');
    const homeInput = document.getElementById('homeServiceSearch');
    if (homeForm && homeInput) {
      homeForm.addEventListener('submit', e => {
        const val = homeInput.value.trim();
        if (val) {
          e.preventDefault();
          input.value = val;
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => {
            input.focus();
            doSearch();
          }, 350);
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroSearch);
  } else {
    initHeroSearch();
  }
})();
