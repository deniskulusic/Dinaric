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
          const acordation=document.getElementsByClassName('faq');
for(i=0;i<acordation.length;i++){
  
    acordation[i].addEventListener('click',function(){
      var faqa=this.classList.contains("active");
        var elems = document.querySelectorAll(".faq.active");
        setTimeout(() => lenis.resize(), 550);
        
        
[].forEach.call(elems, function(el) {
    el.classList.remove("active");
});

if(faqa) {
  this.classList.remove("active");
        }
        else{
          this.classList.add("active");
        }
    })
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

