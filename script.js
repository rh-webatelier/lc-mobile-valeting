// Green Acre Tree David Langhan & Sons Roofing Landscaping — nav toggle, sticky header, scroll reveal
(function () {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('primary-nav');
  const header = document.getElementById('site-header');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('nav--open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('nav--open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // sticky header background after scrolling past the top of the hero
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-stuck', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => observer.observe(el));
    // Above-the-fold hero content should never sit hidden waiting on the observer
    document.querySelectorAll('.hero .reveal').forEach((el) => el.classList.add('is-visible'));
    // Safety net: if anything is still hidden shortly after load, reveal it
    window.addEventListener('load', () => {
      setTimeout(() => revealEls.forEach((el) => el.classList.add('is-visible')), 1200);
    });
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }
})();

// ===== enhancements: js flag, lazy fade, gallery lightbox, inline form success (rh-webatelier) =====
(function(){
  document.documentElement.classList.add('js');

  // lazy image fade-in
  var lazy = Array.prototype.slice.call(document.querySelectorAll('img[loading="lazy"]'));
  lazy.forEach(function(img){
    if (img.complete) img.classList.add('is-loaded');
    else {
      img.addEventListener('load', function(){ img.classList.add('is-loaded'); }, { once:true });
      img.addEventListener('error', function(){ img.classList.add('is-loaded'); }, { once:true });
    }
  });
  window.addEventListener('load', function(){ lazy.forEach(function(i){ i.classList.add('is-loaded'); }); });

  // gallery lightbox with swipe / keyboard
  var imgs = Array.prototype.slice.call(document.querySelectorAll('.gallery__item img'));
  if (imgs.length){
    var idx = 0, box = null;
    function build(){
      box = document.createElement('div');
      box.className = 'lightbox';
      box.setAttribute('role','dialog'); box.setAttribute('aria-modal','true');
      box.innerHTML = '<button class="lightbox__close" aria-label="Close">×</button>'
        + '<button class="lightbox__nav lightbox__nav--prev" aria-label="Previous">‹</button>'
        + '<img alt=""><div class="lightbox__cap"></div>'
        + '<button class="lightbox__nav lightbox__nav--next" aria-label="Next">›</button>';
      document.body.appendChild(box);
      box.querySelector('.lightbox__close').addEventListener('click', close);
      box.querySelector('.lightbox__nav--prev').addEventListener('click', function(e){ e.stopPropagation(); show(idx-1); });
      box.querySelector('.lightbox__nav--next').addEventListener('click', function(e){ e.stopPropagation(); show(idx+1); });
      box.addEventListener('click', function(e){ if (e.target === box) close(); });
      var x0 = null;
      box.addEventListener('touchstart', function(e){ x0 = e.touches[0].clientX; }, { passive:true });
      box.addEventListener('touchend', function(e){
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 45) show(idx + (dx < 0 ? 1 : -1));
        x0 = null;
      });
      document.addEventListener('keydown', function(e){
        if (!box || !box.classList.contains('is-open')) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowRight') show(idx+1);
        else if (e.key === 'ArrowLeft') show(idx-1);
      });
    }
    function show(i){
      idx = (i + imgs.length) % imgs.length;
      var s = imgs[idx];
      box.querySelector('img').src = s.getAttribute('src');
      var fig = s.closest('figure');
      var cap = fig ? fig.querySelector('figcaption') : null;
      box.querySelector('.lightbox__cap').textContent = cap ? cap.textContent : '';
    }
    function open(i){ if (!box) build(); show(i); box.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
    function close(){ if (box){ box.classList.remove('is-open'); document.body.style.overflow = ''; } }
    imgs.forEach(function(img, i){ img.addEventListener('click', function(){ open(i); }); });
  }

  // inline form success (formsubmit AJAX, falls back to normal submit)
  var form = document.querySelector('form.quote-form');
  if (form && window.fetch){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]') || form.querySelector('button');
      var label = btn ? btn.textContent : '';
      if (btn){ btn.disabled = true; btn.textContent = 'Sending…'; }
      fetch(form.action, { method:'POST', body:new FormData(form), headers:{ 'Accept':'application/json' } })
        .then(function(r){ if (!r.ok) throw new Error('bad'); return r.json().catch(function(){ return {}; }); })
        .then(function(){
          var ok = document.createElement('div');
          ok.className = 'form-success';
          ok.innerHTML = '<div class="form-success__check"><svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg></div>'
            + '<h3>Thanks — message sent</h3><p>We’ll be in touch shortly to arrange a look at the job.</p>';
          form.replaceWith(ok);
        })
        .catch(function(){ if (btn){ btn.disabled = false; btn.textContent = label; } form.submit(); });
    });
  }
})();
