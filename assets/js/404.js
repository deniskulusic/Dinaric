(function () {
document.querySelector(".han-menu-full").addEventListener("click", function() {
  const menu = document.querySelector(".menu-full");
  const isActive = menu.classList.toggle("menu-active");
});


document.querySelector(".lng-button").addEventListener('click',function(){
  document.querySelector(".button-header-holder").classList.toggle("lng-active")
});


   const navbar      = document.querySelector('.navbar');
  const searchBtn   = document.querySelector('.search');
  const overlay     = document.querySelector('.search-overlay');
  const searchInput = document.querySelector('.search-overlay-input');
  const logo        = document.querySelector('.logo');
  const btnHolder   = document.querySelector('.button-header-holder');

  if (!navbar || !searchBtn || !overlay || !logo || !btnHolder) return;

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
})();