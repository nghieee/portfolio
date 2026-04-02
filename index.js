// ---
const headerEl = document.querySelector(".header");
const hamMenuBtn = document.querySelector(".header__ham-btn");
const smallMenu = document.querySelector(".header__sm-menu");
const headerSmallMenuLinks = document.querySelectorAll(".header__sm-menu-link");

function closeMobileMenu() {
    if (!smallMenu || !hamMenuBtn) return;
    smallMenu.classList.remove("header__sm-menu--active");
    hamMenuBtn.classList.remove("header__ham-btn--open");
    hamMenuBtn.setAttribute("aria-expanded", "false");
    hamMenuBtn.setAttribute("aria-label", "Open menu");
}

if (hamMenuBtn && smallMenu) {
    hamMenuBtn.addEventListener("click", () => {
        const open = smallMenu.classList.toggle("header__sm-menu--active");
        hamMenuBtn.classList.toggle("header__ham-btn--open", open);
        hamMenuBtn.setAttribute("aria-expanded", open ? "true" : "false");
        hamMenuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
}

for (let i = 0; i < headerSmallMenuLinks.length; i++) {
    headerSmallMenuLinks[i].addEventListener("click", () => {
        closeMobileMenu();
    });
}

function updateHeaderScrolled() {
    if (!headerEl) return;
    const hero = document.querySelector(".home-hero");
    const projectHero = document.querySelector(".project-cs-hero");
    const darkHero = hero || projectHero;
    const threshold = darkHero ? Math.min(darkHero.offsetHeight * 0.5, 420) : 72;
    if (!darkHero || window.scrollY > threshold) {
        headerEl.classList.add("header--scrolled");
    } else {
        headerEl.classList.remove("header--scrolled");
    }
}

window.addEventListener("scroll", updateHeaderScrolled, { passive: true });
window.addEventListener("resize", updateHeaderScrolled);
document.addEventListener("DOMContentLoaded", updateHeaderScrolled);

function initAboutReveal() {
    const els = document.querySelectorAll(".about-reveal");
    if (!els.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        els.forEach((el) => el.classList.add("about-reveal--in"));
        return;
    }
    const obs = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("about-reveal--in");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((el) => obs.observe(el));
}

document.addEventListener("DOMContentLoaded", initAboutReveal);

// ---
const headerLogoConatiner = document.querySelector(".header__logo-container");

if (headerLogoConatiner) {
    headerLogoConatiner.addEventListener("click", () => {
        location.href = "index.html";
    });
}

// Social media links
const socialMediaLinks = {
    linkedin: "https://www.linkedin.com/in/nghie2012/",
    github: "https://github.com/nghieee",
    instagram: "https://www.instagram.com/ng_hiee/",
};

// Function to update social media links
function updateSocialLinks() {
    // Update hero section social links
    const heroSocialLinks = document.querySelectorAll(".home-hero__social-icon-link, .home-hero__dock-link");
    heroSocialLinks.forEach((link) => {
        if (link.querySelector('img[src*="linkedin"]')) {
            link.href = socialMediaLinks.linkedin;
        } else if (link.querySelector('img[src*="github"]')) {
            link.href = socialMediaLinks.github;
        } else if (link.querySelector('img[src*="insta"]')) {
            link.href = socialMediaLinks.instagram;
        }
        // Add target and rel attributes for better UX and security
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    });

    // Update footer social links
    const footerSocialLinks = document.querySelectorAll(".main-footer__social-link");
    footerSocialLinks.forEach((link) => {
        if (link.querySelector('img[src*="linkedin"]')) {
            link.href = socialMediaLinks.linkedin;
        } else if (link.querySelector('img[src*="github"]')) {
            link.href = socialMediaLinks.github;
        } else if (link.querySelector('img[src*="insta"]')) {
            link.href = socialMediaLinks.instagram;
        }
        // Add target and rel attributes for better UX and security
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    });
}

// Call the function when the document is loaded
document.addEventListener("DOMContentLoaded", updateSocialLinks);

// Certificate modal preview
// Certificate modal removed — certificates now open in a new tab
