/**
 * Scroll narrative v2 — Lenis smooth scroll + Three.js wireframe field + GSAP ScrollTrigger.
 * Desktop ≥901px only. Deliberately different from the earlier particle cloud + right rail + bar.
 */
(function () {
  const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mqNarrow = window.matchMedia("(max-width: 900px)");

  const CHAPTERS = [
    { id: "home-hero", label: "Intro" },
    { id: "about", label: "About" },
    { id: "projects", label: "Work" },
    { id: "certificates", label: "Proof" },
    { id: "contact", label: "Contact" },
  ];

  function buildOrbit() {
    const wrap = document.createElement("div");
    wrap.className = "story-orbit";
    wrap.setAttribute("aria-hidden", "true");
    const disc = document.createElement("div");
    disc.className = "story-orbit__disc";
    disc.style.setProperty("--p", "0");
    wrap.appendChild(disc);
    document.body.appendChild(wrap);
    return disc;
  }

  function buildBeacon(lenis) {
    const nav = document.createElement("nav");
    nav.className = "story-beacon";
    nav.id = "story-beacon";
    nav.setAttribute("aria-label", "Story chapters");

    CHAPTERS.forEach((ch, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "story-beacon__btn";
      b.dataset.chapter = ch.id;
      b.innerHTML = `<span class="story-beacon__ix">${String(i + 1).padStart(2, "0")}</span><span class="story-beacon__name">${ch.label}</span>`;
      b.addEventListener("click", () => {
        const sel = `#${ch.id}`;
        if (lenis && typeof lenis.scrollTo === "function") {
          lenis.scrollTo(sel, { offset: -92, duration: 1.15 });
        } else {
          document.getElementById(ch.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
      nav.appendChild(b);
    });
    document.body.appendChild(nav);
    return nav;
  }

  function setActiveBeacon(nav, id) {
    if (!nav) return;
    nav.querySelectorAll(".story-beacon__btn").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.chapter === id);
    });
  }

  function initThree(canvas, getScrollProg, getPhaseNorm, getTime) {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 200);
    camera.position.set(0, 0, 32);

    const g1 = new THREE.IcosahedronGeometry(11, 1);
    const wire1 = new THREE.LineSegments(
      new THREE.EdgesGeometry(g1),
      new THREE.LineBasicMaterial({ color: 0x5eead4, transparent: true, opacity: 0.5 })
    );
    const g2 = new THREE.TorusKnotGeometry(5.2, 1.35, 120, 14);
    const wire2 = new THREE.LineSegments(
      new THREE.EdgesGeometry(g2),
      new THREE.LineBasicMaterial({ color: 0xf472b6, transparent: true, opacity: 0.42 })
    );
    const g3 = new THREE.OctahedronGeometry(4.2, 0);
    const wire3 = new THREE.LineSegments(
      new THREE.EdgesGeometry(g3),
      new THREE.LineBasicMaterial({ color: 0xc4b5fd, transparent: true, opacity: 0.38 })
    );
    wire2.position.set(0, 0, 0);
    wire3.position.set(8, -5, -4);
    scene.add(wire1, wire2, wire3);

    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    function tick(now) {
      const t = getTime(now);
      const sp = getScrollProg();
      const ph = getPhaseNorm();
      camera.position.z = 34 - ph * 14 - sp * 4;
      const spin = sp * Math.PI * 2.2 + t * 0.11;
      wire1.rotation.set(sp * 0.55 + t * 0.05, spin, 0);
      wire2.rotation.set(sp * 0.9 + t * 0.08, spin * 1.3, sp * 0.2);
      wire3.rotation.set(t * 0.12, -spin * 0.6, sp * 0.4);
      wire1.material.opacity = 0.22 + sp * 0.35 + ph * 0.12;
      wire2.material.opacity = 0.18 + ph * 0.22;
      wire3.material.opacity = 0.12 + sp * 0.28;
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function initProjectsStrip() {
    const scene = document.querySelector("#projects .projects__story-scene");
    const strap = document.querySelector("#projects .projects__h-strap");
    const track = document.querySelector("#projects .projects__grid");
    if (!scene || !strap || !track) return;

    const getMax = () => Math.max(0, track.scrollWidth - strap.clientWidth);

    gsap.to(track, {
      x: () => -getMax(),
      ease: "none",
      scrollTrigger: {
        trigger: scene,
        start: "top top",
        end: () => `+=${getMax() + window.innerHeight * 0.35}`,
        pin: true,
        scrub: 0.85,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
  }

  function init() {
    if (mqReduce.matches || mqNarrow.matches) return;
    if (typeof THREE === "undefined" || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.warn("scroll-story: missing Three.js or GSAP");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    document.body.classList.add("scroll-story-active");
    document.documentElement.style.scrollBehavior = "auto";

    let lenis = null;
    if (typeof Lenis !== "undefined") {
      lenis = new Lenis({
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 0.92,
        touchMultiplier: 1.1,
      });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    const orbitDisc = buildOrbit();
    const beacon = buildBeacon(lenis);

    let scrollProg = 0;
    let narrativePhase = 0;

    const phaseNorm = () => narrativePhase / Math.max(1, CHAPTERS.length - 1);
    const t0 = performance.now();
    const getTime = (now) => (now - t0) * 0.001;

    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        scrollProg = self.progress;
        if (orbitDisc) orbitDisc.style.setProperty("--p", String(self.progress));
      },
    });

    CHAPTERS.forEach((ch) => {
      const el = document.getElementById(ch.id);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: "top 52%",
        end: "bottom 48%",
        onEnter: () => {
          narrativePhase = CHAPTERS.findIndex((c) => c.id === ch.id);
          setActiveBeacon(beacon, ch.id);
        },
        onEnterBack: () => {
          narrativePhase = CHAPTERS.findIndex((c) => c.id === ch.id);
          setActiveBeacon(beacon, ch.id);
        },
      });
    });
    setActiveBeacon(beacon, "home-hero");

    const canvas = document.getElementById("scroll-story-canvas");
    if (canvas) {
      initThree(
        canvas,
        () => scrollProg,
        () => phaseNorm(),
        getTime
      );
    }

    const hero = document.getElementById("home-hero");
    if (hero) {
      const copy = hero.querySelector(".home-hero__copy");
      const media = hero.querySelector(".home-hero__media");
      const vignette = hero.querySelector(".home-hero__vignette");
      const title = hero.querySelector(".home-hero__title");
      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      })
        .fromTo(copy, { y: 0, opacity: 1, skewY: 0 }, { y: -100, opacity: 0.08, skewY: -3 }, 0)
        .fromTo(media, { y: 0, scale: 1, rotateZ: 0 }, { y: 72, scale: 1.14, rotateZ: 4 }, 0)
        .fromTo(vignette, { opacity: 1 }, { opacity: 0.35 }, 0)
        .fromTo(title, { scale: 1, filter: "blur(0px)" }, { scale: 0.9, filter: "blur(2px)" }, 0);
    }

    document.querySelectorAll(".about-neo__bg, .projects__bg, .certificates__bg, .contact__bg").forEach((bg) => {
      const section = bg.closest("section");
      if (!section) return;
      gsap.fromTo(
        bg,
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            scrub: 1.2,
            start: "top bottom",
            end: "bottom top",
          },
        }
      );
    });

    initProjectsStrip();

    window.addEventListener(
      "load",
      () => {
        ScrollTrigger.refresh();
        if (lenis) lenis.resize();
      },
      { once: true }
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
