(function () {
  window.history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // If user prefers reduced motion, skip Lenis entirely (accessibility first)
  if (prefersReduced) {
    console.info('[Lenis] Disabled due to prefers-reduced-motion.');
    document.documentElement.style.scrollBehavior = 'smooth';
    return;
  }

  if (typeof window.Lenis !== 'function') {
    console.warn('[Lenis] CDN failed or unavailable. Falling back to native scrolling.');
    return;
  }

  // Initialize Lenis
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => 1 - Math.pow(1 - t, 3),
    lerp: 0.1,
    smoothWheel: true,
    smoothTouch: false
  });
    // Collect targets
    const textEls  = Array.from(document.querySelectorAll('.reveal-text'));
    const imageEls = Array.from(document.querySelectorAll('.reveal-image'));
    const targets  = [...textEls, ...imageEls];

    if (!targets.length) return;

    // Optional: lightweight stagger for siblings
    const applyStagger = (els, base = 70) => {
      els.forEach((el, i) => {
        if (!el.matches('.reveal-text')) return;
        el.dataset.stagger = "1";
        el.style.setProperty('--stagger', `${i * base}ms`);
      });
    };

    // Group consecutive reveal-text siblings for nicer stagger
    let group = [];
    const flushGroup = () => { if (group.length) { applyStagger(group); group = []; } };
    textEls.forEach((el, i) => {
      const prev = textEls[i - 1];
      if (prev && prev.parentElement === el.parentElement) {
        group.push(el);
        if (!group.includes(prev)) group.unshift(prev);
      } else {
        flushGroup();
        group = [el];
      }
    });
    flushGroup();

    // If reduced motion, just mark them visible and bail
    if (prefersReduced) {
      targets.forEach(el => el.classList.add('is-inview'));
      return;
    }

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-inview');
          // Unobserve once revealed (one-time animation)
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      // Reveal a bit before fully on screen for a snappier feel
      rootMargin: '0px 0px -15% 0px',
      threshold: 0.12
    });

    targets.forEach(t => io.observe(t));

    // Optional: if you use Lenis, ensure IO gets regular rAF ticks (helps on some mobile browsers)
    // Your rAF already runs; but we can ping IO’s internal checks during scroll:
    if (window.__lenis) {
      window.__lenis.on('scroll', () => { /* no-op; forces layout/paint cadence with Lenis */ });
    }


const VH = () => window.innerHeight || document.documentElement.clientHeight;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const items = Array.from(document.querySelectorAll('.section-3-element-holder , .section-7-holder , .section-10-img-holder , .blog-element-holder ,.section-argo-1-right-holder , .section-argo-2-img , .section-8-img-holder'))
    .map(el => {
      const picture = el.querySelector('picture');
      const img = picture && picture.querySelector('img');
      console.log(img)
      if (!picture || !img) return null;

      const scale = parseFloat(img.dataset.scale || el.dataset.scale || 1.2);
      return {
        el, img, scale,
        height: 0,
        top: 0,
        extra: 0
      };
    })
    .filter(Boolean);

  const measure = () => {
    items.forEach(it => {
      const rect = it.el.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      it.height = rect.height;
      it.top = rect.top + scrollY;
      it.extra = (it.scale - 1) * it.height;
    });
  };

  measure();
  window.addEventListener('resize', () => requestAnimationFrame(measure), { passive: true });

  // ✅ This is what the raf() will call
  window.updateParallax = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const vh = VH();

    items.forEach(it => {
      const start = it.top - vh;
      const end   = it.top + it.height;
      const t = clamp((scrollY - start) / (end - start), 0, 1);
      const y = (0.5 - t) * it.extra;

      it.img.style.setProperty('--s', it.scale);
      it.img.style.setProperty('--y', `${y}px`);
    });
  };





  // rAF loop — drives Lenis updates
  function raf(time) {
  lenis.raf(time);

  // ✅ add this new line
  if (window.updateParallax) window.updateParallax();

  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

  // Optional: scroll to hash on load if URL contains one (with header offset)
  const stickyOffset = 64; // header height in px
  if (window.location.hash) {
    const el = document.querySelector(window.location.hash);
    if (el) {
      setTimeout(() => lenis.scrollTo(el, { offset: -stickyOffset }), 50);
    }
  }

  // Enhance all in-page anchor links to use Lenis
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const el = document.querySelector(targetId);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -stickyOffset });
      history.pushState(null, '', targetId); // optional
    });
  });

  // Expose for debugging in the console
  window.__lenis = lenis;








  
  /* ===== BASIC ===== */
  let WindowHeight=window.innerHeight;
  const header = document.querySelector('.header');
  const nav = document.querySelector('.menu-full');
  const menu = document.querySelector('.menu-full');
  const growSection = document.querySelector('.section-2');

  

  // Parallax via [data-lenis-speed]
  const SCALE = 0.1;
  lenis.on('scroll', ({ scroll }) => {
    
    if(scroll > 0.7*WindowHeight - 100){
      document.querySelector(".menu-full").classList.add("menu-filled")
    }
    else{
      document.querySelector(".menu-full").classList.remove("menu-filled")
    }


    // Top of the screen (0px offset
  // Top of the screen (0px offset)
  const viewportTop = scroll;

  let insideGrow = false;


    const rectTop = growSection.offsetTop;
    const rectBottom = rectTop + growSection.offsetHeight;
    // Check if viewport top is inside the section boundaries
    if (viewportTop >= rectTop - 108 && viewportTop < rectBottom + 108) {
      insideGrow = true;
    }

  // Toggle the class
  if (insideGrow) {
    console.log("yo")
    menu.classList.add('menu-hidden');
  } else {
    menu.classList.remove('menu-hidden');
  }
    document.querySelectorAll('[data-lenis-speed]').forEach((el) => {
      const speed = parseFloat(el.dataset.lenisSpeed) || 0;
      if(scroll < 1.5*WindowHeight)
      el.style.transform = `translate3d(0, ${scroll * speed * SCALE}px, 0)`;

      
  
    
    });
    
  
  });




if (!menu) return;

    let threshold = window.innerHeight; // 100vh
    const getY = () =>
      (window.__lenis && typeof window.__lenis.scroll === 'number')
        ? window.__lenis.scroll
        : (window.scrollY || document.documentElement.scrollTop || 0);

    const apply = () => {
      const y = getY();
      if (y >= threshold) {
        menu.classList.add('inverted');
      } else {
        menu.classList.remove('inverted');
      }
    };

    // Keep threshold in sync with viewport changes
    const onResize = () => {
      threshold = window.innerHeight;
      apply();
    };
    window.addEventListener('resize', onResize, { passive: true });

    // Hook into Lenis if available; otherwise fall back to native scroll
    if (window.__lenis && typeof window.__lenis.on === 'function') {
      window.__lenis.on('scroll', apply);
    } else {
      window.addEventListener('scroll', apply, { passive: true });
    }

    // Run once on load
    apply();




/* =======================================================
        // 1. SHARED CURSOR LOGIC (for the main slider)
        // ======================================================= */
const cursor = document.createElement('div');
cursor.className = 'drag-cursor';
cursor.setAttribute('aria-hidden', 'true');
// MODIFICATION: Add plus icon and ring elements
cursor.innerHTML = `
    <span class="label">scroll</span>
    <span class="plus-icon">+</span>
    <div class="ring" aria-hidden="true"></div>
`;
document.body.appendChild(cursor);

let cursorRAF = null;
let cursorX = 0, cursorY = 0;
let targetX = 0, targetY = 0;
let cursorScale = 1, targetScale = 1;

function showCursor(){ cursor.classList.add('show'); if(cursorRAF==null) cursorLoop(); }
function hideCursor(){ cursor.classList.remove('show'); if(cursorRAF!=null){ cancelAnimationFrame(cursorRAF); cursorRAF=null; } }

function cursorLoop(){
    cursorX += (targetX - cursorX) * 0.18;
    cursorY += (targetY - cursorY) * 0.18;
    cursorScale += (targetScale - cursorScale) * 0.15;
    // Use style properties for smooth transformation
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    cursor.style.transform = `translate(-50%, -50%) scale(${cursorScale})`;
    cursorRAF = requestAnimationFrame(cursorLoop);
}
window.addEventListener('touchstart', () => hideCursor(), { passive: true });

// Helper to set cursor mode
function setCursorMode(mode) {
    cursor.classList.remove('cursor-mode-drag', 'cursor-mode-scroll', 'cursor-mode-plus');
    cursor.classList.add(`cursor-mode-${mode}`);
    // Update label text
    if (mode === 'drag' || mode === 'scroll') {
        cursor.querySelector('.label').textContent = mode;
    }
}


/* =======================================================
    // 2. PROGRESS BAR LOGIC (Independent)
    // ======================================================= 

const currentSlideCountEl = document.getElementById('currentSlideCount');
const totalSlideCountEl = document.getElementById('totalSlideCount');
const progressBarIndicator = document.getElementById('progressBarIndicator');

function updateProgressBarUI(currentIndex, totalSlides) {
    if (totalSlides === 0) return;
    
    const current = currentIndex + 1;
    // Calculate progress percentage: the bar should fully fill on the LAST slide
    const progress = (current / totalSlides) * 100;

    // Update text counts
    currentSlideCountEl.textContent = "0" + current;
    totalSlideCountEl.textContent = "0" + totalSlides;

    // Update progress indicator width
    progressBarIndicator.style.width = `${progress}%`;
}
*/

/* =======================================================
    // 3. MAIN SLIDER FUNCTIONALITY (Drag & Snap)
    // ======================================================= */

function initSlider(root){
    const viewport = root.querySelector('.slider-viewport');
    const track    = root.querySelector('.slider-track');
    const btnPrev = root.querySelector('.slider-btn.prev');
    const btnNext = root.querySelector('.slider-btn.next');
    const cards = Array.from(root.querySelectorAll('.card'));

    if(!viewport || !track) return;
    
    const isButtonsOnly = root.classList.contains('buttons-only');
    const dragEnabled = !isButtonsOnly && root.dataset.drag !== 'false';

    let offset = 0;           
    let baseOffset = 0;
    let maxScroll = 0;
    let stops = [];
    let momentumRAF = null;

    function measure(){
        const viewW = viewport.clientWidth;

        if (cards.length === 0) {
            baseOffset = 0;
            maxScroll = 0;
            stops = [0];
            return;
        }

        const first = cards[0];
        const last  = cards[cards.length - 1];

        const csFirst = getComputedStyle(first);
        const csLast  = getComputedStyle(last);

        // Calculate total track width and offsets
        const firstLeftOuter = first.offsetLeft - (parseFloat(csFirst.marginLeft) || 0);
        const lastRightOuter = last.offsetLeft + last.offsetWidth + (parseFloat(csLast.marginRight) || 0);
        const totalWidth = lastRightOuter - firstLeftOuter;

        baseOffset = -firstLeftOuter;
        maxScroll = Math.max(0, totalWidth - viewW);

        // Precompute snap positions (aligned to the left edge of each card)
        stops = cards.map(card => {
            const cs = getComputedStyle(card);
            const leftOuter = card.offsetLeft - (parseFloat(cs.marginLeft) || 0);
            return clamp(-leftOuter); // Ensure stops are clamped
        });
        
        // Keep offset within bounds
        offset = clamp(offset);
    }

    function clamp(x){
        const min = baseOffset - maxScroll;
        const max = baseOffset;
        return Math.max(min, Math.min(max, x));
    }

    function render(){
        track.style.transform = `translateX(${offset}px)`;
        
        // Update buttons
        if (btnPrev) btnPrev.disabled = (offset >= baseOffset - 0.5);
        if (btnNext) btnNext.disabled = (offset <= (baseOffset - maxScroll) + 0.5);
        
        // Update Progress Bar
        let currentIndexForProgress = 0;
        // Find the index of the card whose stop position is closest to the current offset
        let minDiff = Infinity;
        let closestIndex = 0;

        stops.forEach((stop, index) => {
            const diff = Math.abs(stop - offset);
            if (diff < minDiff) {
                minDiff = diff;
                closestIndex = index;
            }
        });
        
      /*  updateProgressBarUI(closestIndex, cards.length);*/
    }

    function update(){
        measure();
        // Initial run: align to base offset (first card)
        if (Math.abs(offset) < 0.001 && Math.abs(baseOffset) > 0.001) {
            offset = baseOffset;
        }
        render();
    }

    // Snap logic: Find the next/previous *full card* stop position
    function findNextStop(current){
        const currentCardIndex = stops.findIndex(s => Math.abs(s - current) < 1);
        if (currentCardIndex !== -1 && currentCardIndex < stops.length - 1) {
             return stops[currentCardIndex + 1];
        }
        // Find the first card stop position *to the left* of the current position (if not currently snapped)
        let nextStop = current;
        for (let i = stops.length - 1; i >= 0; i--) {
            if (stops[i] < current - 1) { // Stop is further left than current view
                nextStop = stops[i];
                break;
            }
        }
        return clamp(nextStop);
    }

    function findPrevStop(current){
        const currentCardIndex = stops.findIndex(s => Math.abs(s - current) < 1);
        if (currentCardIndex > 0) {
             return stops[currentCardIndex - 1];
        }
        // Find the first card stop position *to the right* of the current position (if not currently snapped)
        let prevStop = current;
        for (let i = 0; i < stops.length; i++) {
            if (stops[i] > current + 1) { // Stop is further right than current view
                prevStop = stops[i];
                break;
            }
        }
        return clamp(prevStop);
    }
    
    function next(){
        offset = findNextStop(offset);
        render();
    }
    function prev(){
        offset = findPrevStop(offset);
        render();
    }

    // Attach button listeners
    if (btnNext) btnNext.addEventListener('click', next);
    if (btnPrev) btnPrev.addEventListener('click', prev);

    // Resize & Load handling
    const roViewport = new ResizeObserver(update);
    const roTrack    = new ResizeObserver(update);
    roViewport.observe(viewport);
    roTrack.observe(track);
    window.addEventListener('load', update);
    update();
    
    
    /* --- Cursor and Dragging Logic (From User Input) --- */

    if (isButtonsOnly) {
        viewport.addEventListener('pointerenter', () => { 
            showCursor(); 
            setCursorMode('plus');
        });
        viewport.addEventListener('pointerleave', () => { 
            hideCursor(); 
            targetScale=1; 
        });
        viewport.addEventListener('pointermove', (e) => { 
            targetX = e.clientX; 
            targetY = e.clientY; 
        });
        return; 
    }

    // ======= Dragging only if enabled =======
    if (!dragEnabled) return; 

    let isDragging = false;
    let startX = 0, startOffset = 0, lastX = 0, lastTs = 0, velocity = 0;
    const DRAG_THRESHOLD = 3;

    function stopMomentum(){ if (momentumRAF!=null) cancelAnimationFrame(momentumRAF); momentumRAF=null; }
    function startMomentum(){
        stopMomentum();
        const decay = 0.95;
        const minVel = 0.05;
        const frame = () => {
            velocity *= decay;
            if (Math.abs(velocity) < minVel) { stopMomentum(); return; }
            // Apply momentum, clamp, and render
            offset = clamp(offset + velocity * 16); 
            render();

            // Stop momentum if we hit the edge
            if (offset === 0 || offset === (baseOffset - maxScroll)) { 
                velocity = 0; // stop the velocity abruptly
                stopMomentum(); 
                return; 
            }
            momentumRAF = requestAnimationFrame(frame);
        };
        momentumRAF = requestAnimationFrame(frame);
    }

    // Cursor bubble (only for draggable sliders)
    viewport.addEventListener('pointerenter', () => { 
        showCursor(); 
        setCursorMode('scroll'); 
    });
    viewport.addEventListener('pointerleave', () => { hideCursor(); targetScale=1; });
    viewport.addEventListener('pointermove', (e) => { targetX = e.clientX; targetY = e.clientY; });

    // Pointer events for drag
    viewport.addEventListener('pointerdown', (e) => {
        // 🆕 Allow links to be clickable — don't start drag if pointer down on an <a>
        const anchor = e.target.closest('a');
        if (anchor) {
            return; // let the browser handle the link normally
        }

        if (e.button !== 0 && e.pointerType === 'mouse') return;
        viewport.setPointerCapture(e.pointerId);
        stopMomentum();
        isDragging = true;
        startX = lastX = e.clientX;
        startOffset = offset;
        lastTs = performance.now();
        velocity = 0;
        setCursorMode('drag'); 
        targetScale = 0.9;
        viewport.classList.add('dragging');
        e.preventDefault();
    });

    viewport.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const now = performance.now();
        const dxRaw = e.clientX - startX;

        const dxBase = Math.abs(dxRaw) < DRAG_THRESHOLD ? 0 : dxRaw;
        const dx = dxBase * 1; // Drag dampening

        offset = clamp(startOffset + dx);
        render();

        const dt = now - lastTs || 16;
        velocity = (e.clientX - lastX) / dt;
        lastX = e.clientX;
        lastTs = now;

        const speed = Math.min(Math.abs(velocity) * 30, 1);
        targetScale = 1 - speed * 0.35;
    });

    function endDrag(){
        if (!isDragging) return;
        isDragging = false;
        viewport.classList.remove('dragging');
        setCursorMode('scroll'); 
        targetScale = 1;
        
        // Start momentum only if it wasn't a static click and we are not at the edge
        if (Math.abs(velocity) > 0.01 && offset > (baseOffset - maxScroll) + 1 && offset < baseOffset - 1) { 
            startMomentum();
        } else {
            // Snap back if momentum is negligible
            offset = clamp(offset); // Re-clamp just in case
            render();
        }
        velocity = 0; // Reset velocity after drag ends
    }
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
    viewport.addEventListener('lostpointercapture', endDrag);

    track.addEventListener('dragstart', (e) => e.preventDefault());
}

// Initialize all sliders
document.querySelectorAll('.slider').forEach(initSlider);




/* ================= GALLERY LOGIC (DYNAMIC SLIDER) ================= 

// DOM elements
const gallery = document.querySelector('.fullscreen-gallery');
const galleryTrack = document.querySelector('.gallery-track'); // NEW: The track element
const closeBtn = document.querySelector('.gallery-close-btn');
const prevBtn = document.querySelector('.gallery-prev');
const nextBtn = document.querySelector('.gallery-next');
const galleryCounter = document.querySelector('.gallery-counter');

// State
let allImageUrls = [];
let currentIndex = -1;
let totalSlides = 0;
const TRANSITION_DURATION = 700;

// --- Core Functions ---

function collectAllImageUrls() {
    const cards = document.querySelectorAll('.opens-gallery .card');
    allImageUrls = Array.from(cards)
        .map(card => {
            const style = card.style.backgroundImage;
            return style ? style.replace(/url\(['"]?(.*?)['"]?\)/i, '$1') : null;
        })
        .filter(url => url);
    
    totalSlides = allImageUrls.length;
}

// NEW: Function to dynamically build the gallery track
function buildGallerySlides() {
    collectAllImageUrls();
    galleryTrack.innerHTML = ''; // Clear existing content

    allImageUrls.forEach(url => {
        const slide = document.createElement('div');
        slide.classList.add('gallery-slide');

        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Gallery image';

        slide.appendChild(img);
        galleryTrack.appendChild(slide);
    });
}

// 2. Update the gallery view (Modified for sliding the track)
function updateGallery(immediate = false) {
    if (currentIndex < 0 || currentIndex >= totalSlides) return;

    // Calculate the translation distance (e.g., -100vw for index 1, -200vw for index 2)
    const offset = currentIndex * -100; // In percentage/vw

    // Set transition speed
    galleryTrack.style.transitionDuration = immediate ? '0ms' : `${TRANSITION_DURATION}ms`;
    
    // Apply the transformation
    galleryTrack.style.transform = `translateX(${offset}vw)`;

    // Update buttons and counter
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === totalSlides - 1;
    galleryCounter.textContent = `${currentIndex + 1}/${totalSlides}`;
}

// 3. Open the gallery
function openGallery(startIndex) {
    currentIndex = startIndex;
    
    gallery.classList.add('is-open');
    gallery.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Jump instantly to the starting slide
    updateGallery(true); 
}

// 4. Close the gallery
function closeGallery() {
    gallery.classList.remove('is-open');
    gallery.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// --- Event Handlers ---

// Navigation (Simply changes index and calls update)
function navigate(direction) {
    let newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < totalSlides) {
        currentIndex = newIndex;
        updateGallery(false); // Animate the slide
    }
}

// 1. Article click handler (to open the gallery)
document.querySelectorAll('.opens-gallery .card').forEach((card, index) => {
    card.style.cursor = 'pointer'; 
    card.addEventListener('click', (e) => {
        // 🆕 Allow links inside cards to be clickable
        const anchor = e.target.closest('a');
        if (anchor) {
            return; // don't open gallery if a link was clicked
        }

        // Ensure slides are built before opening
        if (totalSlides === 0) buildGallerySlides(); 
        openGallery(index);
    });
});

// 2. Gallery button event listeners
closeBtn.addEventListener('click', closeGallery);
prevBtn.addEventListener('click', () => navigate(-1));
nextBtn.addEventListener('click', () => navigate(1));

// 3. Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!gallery.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
        closeGallery();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault(); 
        navigate(-1);
    } else if (e.key === 'ArrowRight') {
        e.preventDefault(); 
        navigate(1);
    }
});

// Initial Setup: Build the slides when the page loads
window.addEventListener('load', buildGallerySlides);*/



 
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
 
lenis.stop();
function id(v) { return document.getElementById(v); }

function loadbar() {
  let ovrl = id("overlay"),
      prog = id("progress"),
      stat = id("progstat"),
      ovIn = id("overlay-in"), 
      ovInh = document.querySelector("#overlay-in h1");
      ovrl.classList.add("ovrl-loaded-start")
      setTimeout(doneLoading, 500);
  function doneLoading() {

    header.classList.add('header-loaded');
    nav.classList.add('nav-loaded');
    ovrl.classList.add("ovrl-loaded")
    lenis.start();
    setTimeout(function () {
      ovrl.style.display = "none";
      ovrl.style.opacity = 0;
    }, 2000);
  }

}


document.querySelector(".lng-button").addEventListener('click',function(){
  document.querySelector(".button-header-holder").classList.toggle("lng-active")
});

document.addEventListener('DOMContentLoaded', loadbar, false);

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


document.querySelectorAll(".info-more .click-underline").forEach((btn) => {
  btn.addEventListener("click", function () {
    const infoMore = this.closest(".info-more");
    const infoUnder = infoMore.previousElementSibling; // the .info-under above it

    infoUnder.classList.toggle("info-active");
    this.classList.toggle("info-active");

    setTimeout(() => lenis.resize(), 500);
  });
});
/* ============================
     SECTION 1 MAIN SLIDER
     ============================ */
  (function () {
    const viewport = document.querySelector('.slider-viewport');
    const track = document.querySelector('.slider-track');

    if (!viewport || !track) return;

    const cards = Array.from(track.querySelectorAll('.card'));
    const btnPrev = document.querySelector('.slider-btn.prev');
    const btnNext = document.querySelector('.slider-btn.next');

    const GAP = 32;     // px between cards
    const CARD_W = 640; // px per card
    const STEP = CARD_W + GAP;

    let offset = 0;

    function clampOffset(x) {
      const totalWidth = cards.length * CARD_W + (cards.length - 1) * GAP;
      const viewW = viewport.clientWidth;
      const maxScroll = Math.max(0, totalWidth - viewW);
      const min = -maxScroll;
      const max = 0;
      return Math.max(min, Math.min(max, x));
    }

    function update() {
      track.style.transform = `translateX(${offset}px)`;

      if (btnPrev) btnPrev.disabled = (offset >= 0);

      const totalWidth = cards.length * CARD_W + (cards.length - 1) * GAP;
      const viewW = viewport.clientWidth;
      const maxScroll = Math.max(0, totalWidth - viewW);
      const maxAbs = Math.abs(offset);
      if (btnNext) btnNext.disabled = (maxAbs >= maxScroll - 0.5);
    }

    function next() {
      offset = clampOffset(offset - STEP);
      update();
    }

    function prev() {
      offset = clampOffset(offset + STEP);
      update();
    }

    if (btnNext) btnNext.addEventListener('click', next);
    if (btnPrev) btnPrev.addEventListener('click', prev);
    window.addEventListener('resize', update);

    update();
  })();


  /* ============================
     SHARED HELPERS FOR SECTION-2 / SECTION-6
     ============================ */

  function splitIntoLines(blockEl) {
    const walker = document.createTreeWalker(blockEl, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.nodeValue.replace(/\s/g, '').length
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    });

    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    const seg = (typeof Intl !== 'undefined' && Intl.Segmenter)
      ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
      : null;

    textNodes.forEach((tn) => {
      const src = tn.nodeValue;
      let pieces = src.split(/(\s+)/).filter(s => s.length > 0);

      if (pieces.length === 1) {
        pieces = seg
          ? Array.from(seg.segment(src), s => s.segment)
          : Array.from(src);
      }

      const frag = document.createDocumentFragment();

      pieces.forEach((part) => {
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else {
          const span = document.createElement('span');
          span.className = 'word-token';
          span.style.display = 'inline-block';
          span.textContent = part;
          frag.appendChild(span);
        }
      });

      tn.parentNode.replaceChild(frag, tn);
    });

    const tokens = Array.from(blockEl.querySelectorAll('.word-token'));
    if (!tokens.length) return;

    const lines = [];
    let currentTop = null;
    let group = [];

    tokens.forEach((tok) => {
      const top = Math.round(tok.getBoundingClientRect().top);
      if (currentTop === null || Math.abs(top - currentTop) <= 1) {
        currentTop = (currentTop === null) ? top : currentTop;
        group.push(tok);
      } else {
        lines.push(group);
        group = [tok];
        currentTop = top;
      }
    });

    if (group.length) lines.push(group);

    const wrapper = document.createElement('div');
    wrapper.className = 'line-block';

    lines.forEach((arr) => {
      const line = document.createElement('span');
      line.className = 'line';
      const inner = document.createElement('span');
      inner.className = 'line-inner';
      arr.forEach((tok) => inner.appendChild(tok));
      line.appendChild(inner);
      wrapper.appendChild(line);
    });

    blockEl.innerHTML = '';
    blockEl.appendChild(wrapper);
  }

  function buildLeftPerLineFromSlide(slideEl) {
    const wrap = document.createElement('div');
    const src = slideEl.querySelector('.slide-text');
    wrap.innerHTML = src ? src.innerHTML : '';

    wrap.querySelectorAll('h4, h3, p').forEach(splitIntoLines);

    const a = wrap.querySelector('a');
    if (a) {
      const linkText = a.textContent;
      a.textContent = ' ';
      const line = document.createElement('span');
      line.className = 'line';
      const inner = document.createElement('span');
      inner.className = 'line-inner';
      inner.textContent = linkText;
      line.appendChild(inner);
      a.appendChild(line);
    }

    return wrap;
  }

  function swapLeftTextPerLine(container, slideEl) {
    if (!container) return;

    const current = container.lastElementChild;
    const nextEl = buildLeftPerLineFromSlide(slideEl);

    const h = container.offsetHeight;
    container.style.minHeight = h + 'px';

    nextEl.querySelectorAll('.line').forEach((line) => line.classList.add('line-enter'));

    container.appendChild(nextEl);

    nextEl.offsetHeight;

    if (current) {
      current.querySelectorAll('.line').forEach((line) => line.classList.add('line-exit'));
      current.offsetHeight;
      current.classList.add('line-exit-active');
      current.querySelectorAll('.line').forEach((line) => line.classList.add('line-exit-active'));
    }

    nextEl.querySelectorAll('.line').forEach((line) => {
      line.classList.add('line-enter-active');
    });

    const lastIncoming = nextEl.querySelector('.line:last-child .line-inner') || nextEl;
    lastIncoming.addEventListener('transitionend', () => {
      if (current) current.remove();
      nextEl.querySelectorAll('.line').forEach((line) => {
        line.classList.remove('line-enter', 'line-enter-active');
      });
      container.style.minHeight = '';
    }, { once: true });
  }

  // BIG BACKGROUND: use SAME image as thumbs (.slide-picture)
  function swapLeftImageWipe(slideEl, leftHold) {
    if (!leftHold) return;
    const pic = slideEl.querySelector('.slide-picture');
    const nextHTML = pic ? pic.innerHTML : '';
    if (!nextHTML) return;

    const overlay = document.createElement('div');
    overlay.className = 'wipe-layer wipe-enter';
    overlay.innerHTML = nextHTML;

    leftHold.appendChild(overlay);

    overlay.offsetHeight;
    overlay.classList.add('wipe-enter-active');

    overlay.addEventListener('transitionend', () => {
      leftHold.innerHTML = '';
      const stable = document.createElement('div');
      stable.className = 'fit';
      stable.innerHTML = nextHTML;
      leftHold.appendChild(stable);
    }, { once: true });
  }

  function swapNumber(numWrap, newStr) {
    if (!numWrap) return;

    const current = numWrap.querySelector('.num-swap');
    const nextNum = document.createElement('span');
    nextNum.className = 'section-2-numbers-current num-swap num-enter from-top';
    nextNum.textContent = newStr;

    numWrap.appendChild(nextNum);
    nextNum.offsetHeight;
    nextNum.classList.add('num-enter-active');

    if (current) {
      current.classList.add('num-exit', 'to-bottom', 'num-exit-active');
      current.addEventListener('transitionend', () => current.remove(), { once: true });
    }

    nextNum.addEventListener('transitionend', () => {
      nextNum.classList.remove('from-top', 'num-enter', 'num-enter-active');
    }, { once: true });
  }

  function setProgressBar(progressEl, index, total) {
    if (!progressEl || !total) return;
    const progress = ((index + 1) / total) * 100;
    progressEl.style.setProperty('--progress', `${progress}%`);
  }


  /* ============================
     PER-SECTION INITIALIZER
     ============================ */
  function initSection(root) {
    if (!root) return;

    const prevBtn    = root.querySelector('.slider-btn.prev');
    const nextBtn    = root.querySelector('.slider-btn.next');
    const leftBox    = root.querySelector('.section-2-right-down-left');
    const rightDown  = root.querySelector('.section-2-right-down-right');
    const leftHold   = root.querySelector('.section-2-left-holder');
    const numWrap    = root.querySelector('.num-swap-wrap');
    const numAllEl   = root.querySelector('.section-2-numbers-all');
    const progressEl = root.querySelector('.progress-bar-p');

    const slideEls   = Array.from(root.querySelectorAll('.section-2-slides .slide'));
    if (!slideEls.length) return;

    if (numAllEl) numAllEl.textContent = String(slideEls.length).padStart(2, '0');

    if (leftHold && !leftHold.querySelector('.fit')) {
      const fit = document.createElement('div');
      fit.className = 'fit';
      const currentLeftPic = leftHold.querySelector('picture') || leftHold.querySelector('img');
      if (currentLeftPic) fit.appendChild(currentLeftPic);
      leftHold.appendChild(fit);
    }

    // === RIGHT-SIDE THUMB SLIDER ===
    const thumbViewport = rightDown ? rightDown.querySelector('.thumb-viewport') : null;
    const thumbTrack    = rightDown ? rightDown.querySelector('.thumb-track') : null;
    const thumbCards    = [];

    if (thumbViewport && thumbTrack && slideEls.length) {
      slideEls.forEach((slideEl, idx) => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'thumb-card';

        // Thumbnail image (same as big background)
        const pic = slideEl.querySelector('.slide-picture picture, .slide-picture img');
        if (pic) {
          card.appendChild(pic.cloneNode(true));
        }

        // Label from <p> text
        const pEl = slideEl.querySelector('.slide-text p');
        if (pEl) {
          const label = document.createElement('div');
          label.className = 'thumb-label';
          label.textContent = pEl.textContent.trim();
          card.appendChild(label);
        }

        card.addEventListener('click', () => {
          if (isAnimating) return;
          startCooldown();
          goTo(idx);
        });

        thumbTrack.appendChild(card);
        thumbCards.push(card);
      });
    }

    function updateThumbPosition(index) {
      if (!thumbViewport || !thumbTrack || !thumbCards.length) return;

      const activeCard = thumbCards[index];
      thumbCards.forEach((c, i) => c.classList.toggle('is-active', i === index));

      const trackWidth    = thumbTrack.scrollWidth;
      const viewportWidth = thumbViewport.clientWidth;

      let targetX = -activeCard.offsetLeft;
      const maxScroll = Math.max(0, trackWidth - viewportWidth);
      if (targetX < -maxScroll) targetX = -maxScroll;
      if (targetX > 0) targetX = 0;

      thumbTrack.style.transform = `translateX(${targetX}px)`;
    }

    let isAnimating = false;
    const COOLDOWN_MS = 1500;
    function startCooldown() {
      isAnimating = true;
      setTimeout(() => { isAnimating = false; }, COOLDOWN_MS);
    }

    let currentIndex = 0;

    function goTo(idx) {
      if (!slideEls.length) return;

      if (idx < 0) idx = slideEls.length - 1;
      if (idx >= slideEls.length) idx = 0;
      currentIndex = idx;

      const slideEl = slideEls[currentIndex];
      const numStr  = slideEl.dataset.number || String(currentIndex + 1).padStart(2, '0');

      // LEFT: text + big image
      swapLeftTextPerLine(leftBox, slideEl);
      swapLeftImageWipe(slideEl, leftHold);

      // NUMBERS + PROGRESS
      swapNumber(numWrap, numStr);
      setProgressBar(progressEl, currentIndex, slideEls.length);

      // RIGHT: move thumbs so this one is flush left
      updateThumbPosition(currentIndex);
    }

    // initial sync
    goTo(0);

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (isAnimating) return;
        startCooldown();
        goTo(currentIndex + 1);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (isAnimating) return;
        startCooldown();
        goTo(currentIndex - 1);
      });
    }

    if (thumbViewport) {
      window.addEventListener('resize', () => updateThumbPosition(currentIndex));
    }
  }

  /* ============================
     INIT-ONCE + TABS
     ============================ */

  function initSectionOnce(section) {
    if (!section || section.dataset.initialized === 'true') return;
    initSection(section);
    section.dataset.initialized = 'true';
  }

  // Tab headers
  const tabs = Array.from(document.querySelectorAll('.pre-section-2 .gallery-tab'));
  const galleries = Array.from(document.querySelectorAll('.section-2'));

  function showGalleryById(id) {
    galleries.forEach(sec => {
      if (sec.id === id) {
        sec.classList.add('is-active');
        initSectionOnce(sec);
      } else {
        sec.classList.remove('is-active');
      }
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.gallery;
      tabs.forEach(t => t.classList.remove('tab-active'));
      tab.classList.add('tab-active');
      showGalleryById(targetId);
    });
  });

  // Initial: first tab / gallery active
  if (tabs.length) {
    const firstId = tabs[0].dataset.gallery;
    tabs[0].classList.add('tab-active');
    showGalleryById(firstId);
  }

  // If you also have .section-6 using the same pattern, init them once:
  document.querySelectorAll('.section-6').forEach(initSectionOnce);

})();
