// assets/js/app.js

// 1) Navbar on scroll
(function(){
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const onScroll = () => {
    if (window.scrollY > 10) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  document.addEventListener('scroll', onScroll);
  onScroll();
})();

// 2) Mark 'active' link sipas faqes (fix: s'prek butonat, s'prek #, punon me URL absolute)
(function () {
  // Merr faqen aktuale (fallback -> index.html)
  const currPath = location.pathname.split('/').pop() || 'index.html';
  const currFile = currPath === '' ? 'index.html' : currPath;

  // Pastro çdo 'active' ekzistues
  document.querySelectorAll('.navbar .nav-link.active').forEach(a => a.classList.remove('active'));

  // Funksion ndihmës për të nxjerrë emrin e skedarit nga href
  const getFileFromHref = (href) => {
    try {
      // Ignoro anchors ose javascript:
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return null;
      const u = new URL(href, location.origin);            // suporton absolute/relative
      const file = u.pathname.split('/').pop() || 'index.html';
      return file === '' ? 'index.html' : file;
    } catch {
      return null;
    }
  };

  // Vendos active kur përputhet skedari
  document.querySelectorAll('.navbar .nav-link').forEach(a => {
    const file = getFileFromHref(a.getAttribute('href'));
    if (!file) return;                                     // p.sh. #faq
    if (file.toLowerCase() === currFile.toLowerCase()) {
      a.classList.add('active');
    }
  });
})();

// 3) Mini-cart: numëro nga localStorage 'cart'
(function(){
  try {
    const mini  = document.getElementById('miniCart');
    const badge = document.getElementById('miniCartBadge');
    if (!mini || !badge) return;

    const cart = JSON.parse(localStorage.getItem('cart') || '{"items":[]}');
    const count = (cart.items || []).reduce((s,i)=> s + (i.qty||1), 0);

    if (count > 0) {
      mini.classList.remove('d-none');
      badge.textContent = String(count);
    } else {
      mini.classList.add('d-none');
    }
  } catch(e){}
})();

// 4) Pricing: shto paketën në 'cart' dhe shko te checkout
(function(){
  function addToCart(item){
    let cart = { items: [] };
    try { cart = JSON.parse(localStorage.getItem('cart')) || cart; } catch(e){}
    if (!Array.isArray(cart.items)) cart.items = [];

    const idx = cart.items.findIndex(x => x.sku === item.sku && x.mode === item.mode);
    if (idx >= 0) cart.items[idx].qty += item.qty || 1;
    else cart.items.push(item);

    localStorage.setItem('cart', JSON.stringify(cart));
  }

  document.querySelectorAll('.buy-plan').forEach(btn=>{
    // GUARD: mos e lidh dy herë
    if (btn.dataset.bound === '1') return;
    btn.dataset.bound = '1';

    btn.addEventListener('click', (e)=>{
      e.preventDefault();

      const plan  = btn.dataset.plan;               // p.sh. 'premium'
      const price = parseFloat(btn.dataset.price);  // 299, 399, 499, 39
      const mode  = btn.dataset.mode;               // 'pay' | 'sub'

      addToCart({
        type: 'plan',
        sku: `PLAN-${plan.toUpperCase()}`,
        title: `Pako ${plan.charAt(0).toUpperCase()+plan.slice(1)}`,
        price,
        currency: 'EUR',
        qty: 1,
        mode
      });

      const base = location.pathname.replace(/[^/]*$/, '');
      location.href = new URL(base + 'checkout.html', location.origin).toString();
    });
  });
})();



// 5) Validim Bootstrap për çdo form[novalidate]
(function(){
  document.querySelectorAll('form[novalidate]').forEach(form=>{
    form.addEventListener('submit', (e)=>{
      if(!form.checkValidity()){
        e.preventDefault();
        form.classList.add('was-validated');
      }
    });
  });
})();


// 6) Success Stories: open modal with dynamic content
(function(){
  const triggers = document.querySelectorAll('.story-open');
  const modalEl  = document.getElementById('storyModal');
  if(!triggers.length || !modalEl) return;

  const titleEl = modalEl.querySelector('#storyTitle');
  const descEl  = modalEl.querySelector('#storyDesc');
  const beforeEl= modalEl.querySelector('#storyBefore');
  const afterEl = modalEl.querySelector('#storyAfter');
  const bsModal = new bootstrap.Modal(modalEl);

  triggers.forEach(card => {
    card.addEventListener('click', (e)=>{
      e.preventDefault();
      const t = card.dataset.title || 'Histori suksesi';
      const d = card.dataset.desc  || '';
      const b = card.dataset.before;
      const a = card.dataset.after;

      titleEl.textContent = t;
      descEl.textContent  = d;
      if (b) beforeEl.src = b;
      if (a) afterEl.src  = a;

      bsModal.show();
    });
  });
})();
