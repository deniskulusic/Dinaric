// Respect reduced-motion: skip Lenis if user prefers less motion
    const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced && typeof Lenis === 'function') {
      const lenis = new Lenis({
        duration: 1.1,           // feel free to tweak
        smoothWheel: true,
        smoothTouch: false,
        // easing: (t) => 1 - Math.pow(1 - t, 3), // optional custom easing
      });

      // rAF loop drives Lenis
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Make in-page links use Lenis (with optional sticky-header offset)
      const STICKY_OFFSET = 56; // change if your header height differs
      document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
          const id = a.getAttribute('href');
          if (id.length < 2) return;
          const el = document.querySelector(id);
          if (!el) return;
          e.preventDefault();
          lenis.scrollTo(el, { offset: -STICKY_OFFSET });
          history.pushState(null, '', id);
        });
      });

      // Optional: if page loads with a hash, smooth to it
      if (location.hash) {
        const el = document.querySelector(location.hash);
        if (el) setTimeout(() => lenis.scrollTo(el, { offset: -STICKY_OFFSET }), 50);
      }

      // For console debugging
      window.__lenis = lenis;

      let WindowHeight=window.innerHeight;

      lenis.on('scroll', ({ scroll }) => {
    if(scroll > 0.5*WindowHeight - 108){
      document.querySelector(".menu-full").classList.add("menu-transparent")
    }
    else{
      document.querySelector(".menu-full").classList.remove("menu-transparent")
    }
  });
          document.querySelector(".han-menu-full").addEventListener("click", function() {
  const menu = document.querySelector(".menu-full");
  const isActive = menu.classList.toggle("menu-active");

  if (isActive) {
    // Disable Lenis scrolling
    lenis.stop();
  } else {
    // Re-enable Lenis scrolling
    lenis.start();
  }
          });



          /*Privacy section */
 const NAVBAR_HEIGHT = 108; // your fixed header height
  const STICKY_HEADER_OFFSET = 56; // Lenis offset

  const headings = Array.from(document.querySelectorAll('.right-side > div > h3'));
  const sticky = document.querySelector('.left-side .sticky');

  const ol = document.createElement('ol');
  ol.className = 'toc';

  headings.forEach((h3, i) => {
    if (!h3.id) {
      const base = (h3.textContent || `Section ${i + 1}`)
        .toLowerCase().trim().replace(/[^\w]+/g, '-').replace(/(^-|-$)/g, '');
      let id = base || `section-${i + 1}`;
      let n = 2;
      while (document.getElementById(id)) id = `${base}-${n++}`;
      h3.id = id;
    }

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${h3.id}`;
    a.textContent = h3.textContent || `Section ${i + 1}`;
    li.appendChild(a);
    ol.appendChild(li);
  });

  sticky.innerHTML = '';
  sticky.appendChild(ol);

  const tocLinks = Array.from(ol.querySelectorAll('a'));
  const tocItems = Array.from(ol.querySelectorAll('li'));

  // Smooth scroll via Lenis if available
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced && typeof window.__lenis === 'object' && typeof window.__lenis.scrollTo === 'function') {
    const lenis = window.__lenis;
    tocLinks.forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (!id || id.length < 2) return;
        const el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        lenis.scrollTo(el, { offset: -STICKY_HEADER_OFFSET });
        history.pushState(null, '', id);
      });
    });
  }

  // Track active section
  let sectionTops = [];

  function recalcOffsets() {
    sectionTops = headings.map(h => h.getBoundingClientRect().top + window.scrollY);
  }

  function updateActive(scrollY) {
    const triggerY = scrollY + NAVBAR_HEIGHT;
    let idx = 0;
    for (let i = 0; i < sectionTops.length; i++) {
      if (sectionTops[i] <= triggerY) idx = i; else break;
    }
    tocItems.forEach((li, i) => li.classList.toggle('active', i === idx));
  }

  function handleScroll() {
    updateActive(window.scrollY || document.documentElement.scrollTop || 0);
  }

  recalcOffsets();
  handleScroll();
  window.addEventListener('resize', () => { recalcOffsets(); handleScroll(); });

  if (typeof window.__lenis === 'object' && typeof window.__lenis.on === 'function') {
    window.__lenis.on('scroll', handleScroll);
  } else {
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  window.addEventListener('load', () => { recalcOffsets(); handleScroll(); });

  const rightSide = document.querySelector('.right-side');
  if (rightSide) {
    const mo = new MutationObserver(() => { recalcOffsets(); handleScroll(); });
    mo.observe(rightSide, { childList: true, subtree: true });
  }

  document.querySelector(".lng-button").addEventListener('click',function(){
  document.querySelector(".button-header-holder").classList.toggle("lng-active")
});


   const navbar      = document.querySelector('.navbar');
  const searchBtn   = document.querySelector('.search');
  const overlay     = document.querySelector('.search-overlay');
  const searchInput = document.querySelector('.search-overlay-input');
  const logo        = document.querySelector('.logo');
  const btnHolder   = document.querySelector('.button-header-holder');


  function positionSearchOverlay() {
    const logoRect  = logo.getBoundingClientRect();
    const btnRect   = btnHolder.getBoundingClientRect();
    const navRect   = navbar.getBoundingClientRect();

    // distance between logo's right edge and buttons' left edge
    const width = btnRect.left - logoRect.right;

    // overlay's left relative to navbar
    const left = logoRect.right - navRect.left;

    overlay.style.left  = left + 'px';
    overlay.style.width = width + 'px';
  }

  // toggle on click
  searchBtn.addEventListener('click', function () {
    // recalc every time we open (in case layout changed)
    positionSearchOverlay();

    navbar.classList.toggle('search-open');

    if (navbar.classList.contains('search-open')) {
      // small timeout helps avoid focusing before CSS layout update
      setTimeout(() => searchInput && searchInput.focus(), 10);
    }
  });

  // close on ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navbar.classList.contains('search-open')) {
      navbar.classList.remove('search-open');
    }
  });

  // RECALC ON RESIZE
  window.addEventListener('resize', function () {
    if (navbar.classList.contains('search-open')) {
      positionSearchOverlay();
    }
  });
    }
     else {
      // Gentle native fallback
      document.documentElement.style.scrollBehavior = 'smooth';
      console.info('[Lenis] Skipped (reduced-motion or script unavailable).');
    }

