const header = document.querySelector("#header");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
const mobileLinks = mobileMenu.querySelectorAll("a");

function setMenu(open) {
  menuToggle.classList.toggle("active", open);
  mobileMenu.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  mobileMenu.setAttribute("aria-hidden", String(!open));
  menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
}

menuToggle.addEventListener("click", () => {
  setMenu(!mobileMenu.classList.contains("open"));
});

mobileLinks.forEach(link => link.addEventListener("click", () => setMenu(false)));

mobileMenu.addEventListener("click", event => {
  if (event.target === mobileMenu) setMenu(false);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") setMenu(false);
});

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 30);
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const revealElements = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("revealed");
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -45px 0px" });

revealElements.forEach(element => observer.observe(element));

const track = document.querySelector("#gallery-track");
const prev = document.querySelector("#gallery-prev");
const next = document.querySelector("#gallery-next");

function galleryStep() {
  return Math.min(track.clientWidth * .78, 705);
}
prev.addEventListener("click", () => track.scrollBy({ left: -galleryStep(), behavior: "smooth" }));
next.addEventListener("click", () => track.scrollBy({ left: galleryStep(), behavior: "smooth" }));

let dragging = false;
let startX = 0;
let startScroll = 0;

track.addEventListener("pointerdown", event => {
  dragging = true;
  startX = event.clientX;
  startScroll = track.scrollLeft;
  track.setPointerCapture(event.pointerId);
  track.style.cursor = "grabbing";
});

track.addEventListener("pointermove", event => {
  if (!dragging) return;
  track.scrollLeft = startScroll - (event.clientX - startX);
});

track.addEventListener("pointerup", () => {
  dragging = false;
  track.style.cursor = "grab";
});

track.addEventListener("pointercancel", () => {
  dragging = false;
  track.style.cursor = "grab";
});

// Parallax leve apenas na arte principal do hero.
const heroImage = document.querySelector(".hero-art img");
window.addEventListener("scroll", () => {
  if (window.innerWidth > 768 && heroImage) {
    const y = Math.min(window.scrollY * 0.06, 25);
    heroImage.style.translate = `0 ${y}px`;
  }
}, { passive: true });
