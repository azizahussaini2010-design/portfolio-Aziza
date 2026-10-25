document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const menuToggle = document.getElementById("menuToggle");
  const siteNav = document.getElementById("siteNav");
  const progressBar = document.getElementById("progressBar");

  // Keep a friendly photo placeholder visible until aziza-photo.jpg is added.
  const personalPhoto = document.querySelector(".personal-photo");
  const photoPlaceholder = document.querySelector(".photo-placeholder");
  if (personalPhoto && photoPlaceholder) {
    const showPlaceholder = () => {
      personalPhoto.style.display = "none";
      photoPlaceholder.style.display = "flex";
    };
    const showPhoto = () => {
      personalPhoto.style.display = "block";
      photoPlaceholder.style.display = "none";
    };
    personalPhoto.addEventListener("error", showPlaceholder);
    personalPhoto.addEventListener("load", showPhoto);
    if (personalPhoto.complete && personalPhoto.naturalWidth > 0) showPhoto();
  }

  
  function closeMenu() {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    siteNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    siteNav.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  siteNav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 650) closeMenu();
  });


  function updateProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // Progressive enhancement: the page remains readable if GSAP/CDN is unavailable.
  if (window.gsap && !reduceMotion) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".hero-eyebrow", {
      opacity: 0, y: 15, duration: 0.7, ease: "power2.out", delay: 0.15
    });
    gsap.from(".hero h1", {
      opacity: 0, y: 35, duration: 1, ease: "power3.out", delay: 0.25
    });
    gsap.from(".hero-intro, .hero-actions, .hero-footnote", {
      opacity: 0, y: 18, duration: 0.8, stagger: 0.12, ease: "power2.out", delay: 0.5
    });
    gsap.from(".photo-main", {
      opacity: 0, scale: 0.96, duration: 1.2, ease: "power3.out", delay: 0.25
    });
    gsap.from(".photo-small", {
      opacity: 0, y: 20, duration: 0.9, ease: "power3.out", delay: 0.55
    });

    gsap.utils.toArray(".reveal").forEach((element) => {
      gsap.from(element, {
        opacity: 0,
        y: 24,
        duration: 0.75,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 88%",
          once: true
        }
      });
    });

    gsap.to(".orbit-star", {
      rotation: 35,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    gsap.to(".contact-orbit", {
      rotation: 360,
      duration: 70,
      repeat: -1,
      ease: "none"
    });
  } else {
    document.querySelectorAll(".reveal").forEach(element => element.classList.add("is-visible"));
  }

  // Subtle pointer movement on larger screens only
  const hoverTargets = document.querySelectorAll(".button, .nav-cta");
  if (window.matchMedia("(pointer: fine)").matches && !reduceMotion) {
    hoverTargets.forEach(target => {
      target.addEventListener("pointermove", event => {
        const rect = target.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        target.style.transform = `translate(${x * 0.06}px, ${y * 0.08}px)`;
      });
      target.addEventListener("pointerleave", () => {
        target.style.transform = "";
      });
    });
  }
});
