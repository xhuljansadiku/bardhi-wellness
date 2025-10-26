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

// 2) Mark 'active' link sipas faqes
(function(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar .nav-link, .navbar .btn').forEach(a=>{
    const href = (a.getAttribute('href')||'').split('/').pop();
    if (href && href === path) a.classList.add('active');
  });
})();

// 3) Mini-cart: shfaq nëse ka pending order nga pricing → checkout
(function(){
  try {
    const pending = JSON.parse(localStorage.getItem('pendingOrder') || 'null');
    const mini = document.getElementById('miniCart');
    const badge = document.getElementById('miniCartBadge');
    if (pending && mini && badge) {
      mini.classList.remove('d-none');
      badge.textContent = '1';
      badge.setAttribute('aria-label', `${pending.plan} ${pending.mode} €${pending.price}`);
    }
  } catch(e){}
})();

// 4) Pricing: redirect to checkout dhe ruaj pending order
(function(){
  document.querySelectorAll('.buy-plan').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      const plan  = btn.dataset.plan;                 // basic | premium | supreme | starter
      const price = parseFloat(btn.dataset.price);    // 299 | 399 | 499 | 39 ...
      const mode  = btn.dataset.mode;                 // 'pay' (one-time) | 'sub' (monthly)

      // Ruaj për mini-cart
      const payload = { plan, price, mode };
      localStorage.setItem('pendingOrder', JSON.stringify(payload));

      // Ridrejto në checkout (relative path)
      const url = new URL('checkout.html', location.origin + location.pathname.replace(/[^/]*$/, ''));
      url.searchParams.set('plan', plan);
      url.searchParams.set('mode', mode);
      url.searchParams.set('price', price);
      location.href = url.toString();
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


6 // Success Stories: open modal with dynamic content
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
