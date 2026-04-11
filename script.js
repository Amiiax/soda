/* ===== LOADER ===== */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hide');
  }, 800);
});

/* ===== CUSTOM CURSOR ===== */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

function animateFollower() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  follower.style.left = fx + 'px';
  follower.style.top = fy + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Cursor expand on hover
document.querySelectorAll('a, button, .masonry-item, .featured-img-wrap, .h-scroll-card, .polaroid, .mood-cell, .palette-swatch').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
    cursor.style.opacity = '0.5';
    follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursor.style.opacity = '1';
    follower.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});

/* ===== HEADER SCROLL ===== */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  // Scroll top button
  const scrollTop = document.getElementById('scroll-top');
  if (window.scrollY > 400) {
    scrollTop.classList.add('active');
  } else {
    scrollTop.classList.remove('active');
  }

  // Active nav
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (window.scrollY >= top && window.scrollY < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    }
  });
});

/* ===== MOBILE MENU ===== */
const menuBtn = document.getElementById('menu-btn');
const navbar = document.getElementById('navbar');

menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('open');
  navbar.classList.toggle('open');
});

// Close on nav click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    menuBtn.classList.remove('open');
    navbar.classList.remove('open');
  });
});

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ===== REVEAL ON SCROLL ===== */
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.style.getPropertyValue('--d') || '0s';
      entry.target.style.transitionDelay = delay;
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

/* ===== HORIZONTAL SCROLL (TRADITIONNEL) ===== */
const tradTrack = document.getElementById('trad-track');
const tradPrev = document.getElementById('trad-prev');
const tradNext = document.getElementById('trad-next');

if (tradTrack && tradPrev && tradNext) {
  const scrollAmount = 360;

  tradNext.addEventListener('click', () => {
    tradTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  tradPrev.addEventListener('click', () => {
    tradTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  // Drag to scroll
  let isDown = false, startX, scrollLeft;

  tradTrack.addEventListener('mousedown', (e) => {
    isDown = true;
    tradTrack.style.cursor = 'grabbing';
    startX = e.pageX - tradTrack.offsetLeft;
    scrollLeft = tradTrack.scrollLeft;
  });

  tradTrack.addEventListener('mouseleave', () => { isDown = false; tradTrack.style.cursor = 'grab'; });
  tradTrack.addEventListener('mouseup', () => { isDown = false; tradTrack.style.cursor = 'grab'; });
  tradTrack.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - tradTrack.offsetLeft;
    const walk = (x - startX) * 2;
    tradTrack.scrollLeft = scrollLeft - walk;
  });
}

/* ===== LIGHTBOX ===== */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbClose = document.getElementById('lb-close');
const lbPrev = document.getElementById('lb-prev');
const lbNext = document.getElementById('lb-next');

// Collect all gallery images
const galleryImages = Array.from(document.querySelectorAll(
  '.masonry-item img, .featured-img-wrap img, .h-scroll-card img, .polaroid img, .mood-cell img'
));

let currentLbIndex = 0;

function openLightbox(index) {
  currentLbIndex = index;
  lbImg.src = galleryImages[index].src;
  lbImg.alt = galleryImages[index].alt;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function lbNavigate(dir) {
  currentLbIndex = (currentLbIndex + dir + galleryImages.length) % galleryImages.length;
  lbImg.style.opacity = '0';
  setTimeout(() => {
    lbImg.src = galleryImages[currentLbIndex].src;
    lbImg.alt = galleryImages[currentLbIndex].alt;
    lbImg.style.opacity = '1';
  }, 200);
}

galleryImages.forEach((img, i) => {
  img.parentElement.style.cursor = 'none';
  img.parentElement.addEventListener('click', () => openLightbox(i));
});

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', () => lbNavigate(-1));
lbNext.addEventListener('click', () => lbNavigate(1));

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lbNavigate(-1);
  if (e.key === 'ArrowRight') lbNavigate(1);
});

lbImg.style.transition = 'opacity 0.2s ease';

/* ===== BLOCK DEVTOOLS (same as original) ===== */
document.onkeydown = function (e) {
  if (e.keyCode == 123) return false;
  if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) return false;
  if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) return false;
  if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) return false;
  if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false;
};