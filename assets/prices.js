"use strict";
(() => {
  const data=window.AMBERS_PRICE_DATA;
  const search=document.getElementById('priceSearch');
  const filter=document.getElementById('priceFilter');
  const catalog=document.getElementById('catalog');
  const aside=document.getElementById('categoryFilterList');
  const results=document.getElementById('resultsCount');
  if(!data||!catalog||!filter||!aside)return;
  const sections=data.sections;
  const escapeHTML=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const readable=text=>text.toLowerCase().replace(/(^|\s|[&/-])\S/g,c=>c.toUpperCase());
  const total=sections.reduce((sum,s)=>sum+s.groups.reduce((acc,g)=>acc+g.items.length,0),0);
  const key=str=>String(str||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const asideButtons=[];
  function addButton(name,label,count){
    const b=document.createElement('button');b.type='button';b.className='category-filter';b.dataset.category=name;
    b.innerHTML=`<span>${escapeHTML(label)}</span><small>${count}</small>`;
    b.setAttribute('aria-pressed','false');
    b.addEventListener('click',()=>{filter.value=name;search.value='';render();document.getElementById('catalog-start').scrollIntoView({behavior:'smooth',block:'start'});});
    aside.appendChild(b);asideButtons.push(b);
  }
  addButton('all','All services',total);
  sections.forEach(sec=>{
    const number=sec.groups.reduce((acc,g)=>acc+g.items.length,0);
    const option=document.createElement('option');option.value=sec.name;option.textContent=readable(sec.name);filter.appendChild(option);
    addButton(sec.name,readable(sec.name),number);
  });
  function render(){
    const term=key(search.value.trim());const pick=filter.value;
    const chunks=[];let count=0,categories=0;
    sections.forEach((sec,si)=>{
      if(pick!=='all' && pick!==sec.name)return;
      const groups=[];let categoryCount=0;
      sec.groups.forEach(group=>{
        const items=group.items.filter(item=>!term || key(`${sec.name} ${group.name} ${item.name} ${item.price}`).includes(term));
        if(!items.length)return;
        categoryCount+=items.length;count+=items.length;
        const rows=items.map(item=>{
          const name=escapeHTML(item.name),price=escapeHTML(item.price);
          const service=escapeHTML(`${group.name==='General'?sec.name:group.name} — ${item.name} — PKR ${item.price}`);
          return `<div class="price-row"><span class="name">${name}</span><span class="price-amount"><small>PKR</small><strong>${price}</strong></span><button class="booktiny" type="button" data-book data-service="${service}" aria-label="Enquire about ${escapeHTML(group.name)} ${name}">Enquire <span aria-hidden="true">↗</span></button></div>`;
        }).join('');
        groups.push(`<div class="catalog-group"><h3>${escapeHTML(group.name==='General'?readable(sec.name):group.name)}<small>${items.length} option${items.length===1?'':'s'}</small></h3>${rows}</div>`);
      });
      if(groups.length){categories++;chunks.push(`<section class="cat-section" id="cat-${si}"><div class="category-title-row"><h2><span class="sectnum">${String(si+1).padStart(2,'0')} /</span>${escapeHTML(readable(sec.name))}</h2><span class="category-counter">${categoryCount} prices</span></div>${groups.join('')}</section>`);}
    });
    catalog.innerHTML=chunks.length?chunks.join(''):'<div class="no-results"><span aria-hidden="true">✳</span><h3>No matching services</h3><p>Try a shorter search or explore another category.</p><button class="btn outline" id="emptyClear" type="button">See all prices ↗</button></div>';
    results.textContent=`${count} of ${total} priced options · ${categories} categor${categories===1?'y':'ies'} shown`;
    asideButtons.forEach(b=>{let active=b.dataset.category===pick;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));});
    document.getElementById('emptyClear')?.addEventListener('click',()=>clear(false));
    const params=new URLSearchParams(location.search);
    if(pick==='all')params.delete('category'); else params.set('category',pick);
    if(search.value.trim())params.set('q',search.value.trim());else params.delete('q');
    const url=`${location.pathname}${params.size?'?'+params.toString():''}`;
    try{history.replaceState(null,'',url);}catch{}
  }
  function clear(focus=true){search.value='';filter.value='all';render();if(focus)search.focus();}
  search.addEventListener('input',render);
  filter.addEventListener('change',render);
  document.getElementById('clearSearch').addEventListener('click',()=>clear());
  const url=new URL(location.href);
  const category=url.searchParams.get('category');const q=url.searchParams.get('q');
  if(category && [...filter.options].some(x=>x.value===category))filter.value=category;
  if(q)search.value=q;
  render();
})();
