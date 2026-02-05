// main JS extracted from original single-file HTML

// Set year in footer
(function setYear(){
  const el = document.getElementById('year');
  if(el) el.textContent = new Date().getFullYear();
})();

// Helpers
function isMobileUA(){
  return /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(navigator.userAgent);
}

function showNotice(text){
  const node = document.getElementById('formNotice');
  if(!node) return;
  node.textContent = text;
  node.style.display = 'block';
  clearTimeout(node._hideTimeout);
  node._hideTimeout = setTimeout(()=>{ node.style.display = 'none'; }, 12000);
}

function openTelegramWithFallback(appUrl, webUrl){
  if(isMobileUA()){
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = appUrl;
    document.body.appendChild(iframe);

    const fallback = setTimeout(function(){
      const w = window.open(webUrl, '_blank');
      if(w) w.opener = null;
      try{ document.body.removeChild(iframe); }catch(e){}
    }, 900);

    setTimeout(function(){
      try{ document.body.removeChild(iframe); }catch(e){}
      clearTimeout(fallback);
    }, 2000);
  } else {
    const w = window.open(webUrl, '_blank');
    if(w) w.opener = null;
  }
}

// Telegram username to open chat with (change if needed)
const TELEGRAM_USERNAME = 'Micodiy';

// Helper: build message from form fields
function buildMessagePlain(name, phone, info){
  let parts = [];
  parts.push('Привет!');
  if(name) parts.push('Имя: ' + name);
  if(phone) parts.push('Телефон: ' + phone);
  if(info) parts.push('Коротко: ' + info);
  return parts.join('\n');
}

// Form submit handling
const contactForm = document.getElementById('contactForm');
if(contactForm){
  contactForm.addEventListener('submit', function(e){
    e.preventDefault();
    if(!this.checkValidity()){ this.reportValidity(); return; }

    const name = this.name.value.trim();
    const phone = this.phone.value.trim();
    const info = this.info.value.trim();

    if(!name){ showNotice('Пожалуйста, укажите имя.'); return; }
    if(!phone){ showNotice('Пожалуйста, укажите телефон.'); return; }

    const message = buildMessagePlain(name, phone, info);
    const encoded = encodeURIComponent(message);

    const appUrl = 'tg://resolve?domain=' + encodeURIComponent(TELEGRAM_USERNAME) + '&text=' + encoded;
    const webUrl = 'https://t.me/' + encodeURIComponent(TELEGRAM_USERNAME) + '?text=' + encoded;

    openTelegramWithFallback(appUrl, webUrl);

    showNotice('Открываем Telegram... Если ничего не произошло — откроется веб-версия.');
    this.reset();
  });
}

// Hide fallback text if images load
(function(){
  const heroImg = document.getElementById('heroImg');
  const heroFallback = document.getElementById('heroFallback');
  if(heroImg){
    heroImg.addEventListener('load', ()=>{ if(heroFallback) heroFallback.style.display='none'; });
    heroImg.addEventListener('error', ()=>{ if(heroFallback) heroFallback.style.display='block'; });
    if(heroImg.complete && heroImg.naturalWidth){ if(heroFallback) heroFallback.style.display='none'; }
  }
  const codeImg = document.getElementById('codeImg');
  if(codeImg){ codeImg.addEventListener('error', ()=>{ /* nothing to show */ }); }
})();

// Mobile nav toggle logic
const navToggle = document.getElementById('navToggle');
const navDrawer = document.getElementById('navDrawer');
function openNav(){
  if(!navDrawer) return;
  navDrawer.style.display = 'flex';
  navDrawer.setAttribute('aria-hidden','false');
  if(navToggle) navToggle.setAttribute('aria-expanded','true');
  const first = navDrawer.querySelector('a, button');
  if(first) first.focus();
  document.body.style.overflow = 'hidden';
}
function closeNav(){
  if(!navDrawer) return;
  navDrawer.style.display = 'none';
  navDrawer.setAttribute('aria-hidden','true');
  if(navToggle) navToggle.setAttribute('aria-expanded','false');
  document.body.style.overflow = '';
}
if(navToggle){
  navToggle.addEventListener('click', function(){
    const open = navDrawer && navDrawer.style.display === 'flex';
    if(open) closeNav(); else openNav();
  });
}
// close drawer when clicking overlay outside sheet
if(navDrawer){
  navDrawer.addEventListener('click', function(e){
    if(e.target === navDrawer) closeNav();
  });
  // close on Escape
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeNav(); });
}

// Hook up discuss button to scroll to contact
const discussBtn = document.getElementById('discussBtn');
if(discussBtn){
  discussBtn.addEventListener('click', function(){
    const contact = document.getElementById('contact');
    if(contact) contact.scrollIntoView({behavior:'smooth'});
    closeNav();
  });
}
