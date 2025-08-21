// Dynamic main.js
const $$ = (sel, root=document) => root.querySelector(sel);
const $$$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', ()=>{
  const y = $$('#y'); if(y) y.textContent = new Date().getFullYear();
});

// Reveal
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('is-visible'); observer.unobserve(e.target);} });
},{threshold:0.15});
$$$('.reveal').forEach(el=>observer.observe(el));

// Lazy map
$$('#loadMap')?.addEventListener('click', ()=>{
  const holder = $$('#mapHolder');
  if(holder && !holder.dataset.loaded){
    const iframe = document.createElement('iframe');
    iframe.title = 'Mapa — MoskitoMobil, Warszawa';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.style.width = '100%'; iframe.style.height = '100%'; iframe.style.border = '0';
    iframe.src = 'https://www.google.com/maps?q=ul.%20Wiosenna%2014%2C%2003-123%20Warszawa&output=embed';
    holder.appendChild(iframe);
    holder.dataset.loaded = '1';
    holder.setAttribute('aria-hidden','false');
  }
});

// Appointments
const form = $$('#contactForm');
const formMsg = $$('#formMsg');

function validateAppointment(){
  let ok = true;
  const required = ['name','phone','city','type','qty','date'];
  required.forEach(id=>{ const el = document.getElementById(id); if(!el || !el.value.trim()){ ok=false; } });
  const email = $$('#email')?.value?.trim();
  if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ ok=false; }
  return ok;
}

form?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  if(!validateAppointment()){
    formMsg.textContent = 'Uzupełnij wymagane pola.'; formMsg.style.color = '#b91c1c'; return;
  }
  if(!document.getElementById('rodo')?.checked){
    formMsg.textContent='Zaznacz zgodę RODO.'; formMsg.style.color='#b91c1c'; return;
  }
  const data = Object.fromEntries(new FormData(form).entries());
  try{
    const res = await fetch('/api/appointments', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)});
    if(res.ok){
      form.reset();
      formMsg.textContent = 'Dziękujemy! Skontaktujemy się, aby potwierdzić termin.'; formMsg.style.color='#065f46';
    } else {
      const t = await res.text();
      formMsg.textContent = 'Błąd: ' + t; formMsg.style.color='#b91c1c';
    }
  }catch(err){
    formMsg.textContent = 'Brak połączenia. Spróbuj ponownie.'; formMsg.style.color='#b91c1c';
  }
});

// Reviews
function escapeHTML(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

async function fetchReviews(){
  try{
    const res = await fetch('/api/reviews');
    if(!res.ok) return;
    const items = await res.json();
    const ul = $$('#reviewsList'); if(!ul) return;
    ul.innerHTML = '';
    if(!items.length){ ul.innerHTML = '<li class="review">Brak opinii — bądź pierwszy!</li>'; return; }
    for(const r of items){
      const li = document.createElement('li');
      li.className='review';
      li.innerHTML = `<div class="stars" aria-label="Ocena ${r.rating} na 5">${'★'.repeat(Math.max(1,Math.min(5,r.rating)))}</div>
                      <blockquote>${escapeHTML(r.content)}</blockquote>
                      <cite>— ${escapeHTML(r.name)}</cite>`;
      ul.appendChild(li);
    }
  }catch(e){ /* ignore */ }
}
fetchReviews();

const reviewForm = $$('#reviewForm');
const reviewMsg = $$('#reviewMsg');
reviewForm?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  reviewMsg.textContent='';
  const data = Object.fromEntries(new FormData(reviewForm).entries());
  try{
    const res = await fetch('/api/reviews', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)});
    if(res.ok){
      reviewForm.reset();
      reviewMsg.textContent = 'Dziękujemy! Twoja opinia czeka na akceptację.'; reviewMsg.style.color='#065f46';
    } else {
      const t = await res.text(); reviewMsg.textContent = 'Błąd: ' + t; reviewMsg.style.color='#b91c1c';
    }
  }catch(err){ reviewMsg.textContent = 'Brak połączenia. Spróbuj ponownie.'; reviewMsg.style.color='#b91c1c'; }
});
