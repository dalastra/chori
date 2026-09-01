const header = document.querySelector("#header");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll("a") : [];

function setMenu(open) {
  if (!menuToggle || !mobileMenu) return;

  menuToggle.classList.toggle("active", open);
  mobileMenu.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  mobileMenu.setAttribute("aria-hidden", String(!open));
  menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
}

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    setMenu(!mobileMenu.classList.contains("open"));
  });

  mobileLinks.forEach(link => {
    link.addEventListener("click", () => setMenu(false));
  });

  mobileMenu.addEventListener("click", event => {
    if (event.target === mobileMenu) setMenu(false);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") setMenu(false);
  });
}

function updateHeader() {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 30);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const revealElements = document.querySelectorAll(
  ".reveal-up, .reveal-left, .reveal-right"
);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -45px 0px"
  });

  revealElements.forEach(element => observer.observe(element));
} else {
  revealElements.forEach(element => element.classList.add("revealed"));
}

/* Galeria */
const track = document.querySelector("#gallery-track");
const prev = document.querySelector("#gallery-prev");
const next = document.querySelector("#gallery-next");

if (track) {
  function galleryStep() {
    return Math.min(track.clientWidth * 0.78, 705);
  }

  if (prev) {
    prev.addEventListener("click", () => {
      track.scrollBy({
        left: -galleryStep(),
        behavior: "smooth"
      });
    });
  }

  if (next) {
    next.addEventListener("click", () => {
      track.scrollBy({
        left: galleryStep(),
        behavior: "smooth"
      });
    });
  }

  /* Arrastar a galeria no desktop e mobile */
  let dragging = false;
  let startX = 0;
  let startScroll = 0;

  track.addEventListener("pointerdown", event => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    dragging = true;
    startX = event.clientX;
    startScroll = track.scrollLeft;
    track.setPointerCapture?.(event.pointerId);
    track.style.cursor = "grabbing";
  });

  track.addEventListener("pointermove", event => {
    if (!dragging) return;
    track.scrollLeft = startScroll - (event.clientX - startX);
  });

  const stopDragging = () => {
    dragging = false;
    track.style.cursor = "grab";
  };

  track.addEventListener("pointerup", stopDragging);
  track.addEventListener("pointercancel", stopDragging);
  track.addEventListener("lostpointercapture", stopDragging);
}

/* Parallax leve apenas no desktop */
const heroImage = document.querySelector(".hero-art img");
let parallaxFrame = null;

function updateParallax() {
  if (!heroImage) return;

  if (window.innerWidth > 768) {
    const y = Math.min(window.scrollY * 0.06, 25);
    heroImage.style.translate = `0 ${y}px`;
  } else {
    heroImage.style.translate = "0 0";
  }

  parallaxFrame = null;
}

window.addEventListener("scroll", () => {
  if (parallaxFrame === null) {
    parallaxFrame = requestAnimationFrame(updateParallax);
  }
}, { passive: true });

window.addEventListener("resize", updateParallax);
updateParallax();
