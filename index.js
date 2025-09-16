// ---
const hamMenuBtn = document.querySelector(".header__main-ham-menu-cont");
const smallMenu = document.querySelector(".header__sm-menu");
const headerHamMenuBtn = document.querySelector(".header__main-ham-menu");
const headerHamMenuCloseBtn = document.querySelector(".header__main-ham-menu-close");
const headerSmallMenuLinks = document.querySelectorAll(".header__sm-menu-link");

hamMenuBtn.addEventListener("click", () => {
    if (smallMenu.classList.contains("header__sm-menu--active")) {
        smallMenu.classList.remove("header__sm-menu--active");
    } else {
        smallMenu.classList.add("header__sm-menu--active");
    }
    if (headerHamMenuBtn.classList.contains("d-none")) {
        headerHamMenuBtn.classList.remove("d-none");
        headerHamMenuCloseBtn.classList.add("d-none");
    } else {
        headerHamMenuBtn.classList.add("d-none");
        headerHamMenuCloseBtn.classList.remove("d-none");
    }
});

for (let i = 0; i < headerSmallMenuLinks.length; i++) {
    headerSmallMenuLinks[i].addEventListener("click", () => {
        smallMenu.classList.remove("header__sm-menu--active");
        headerHamMenuBtn.classList.remove("d-none");
        headerHamMenuCloseBtn.classList.add("d-none");
    });
}

// ---
const headerLogoConatiner = document.querySelector(".header__logo-container");

headerLogoConatiner.addEventListener("click", () => {
    location.href = "index.html";
});

// Social media links
const socialMediaLinks = {
    linkedin: "https://www.linkedin.com/in/nghie2012/",
    github: "https://github.com/nghieee",
    instagram: "https://www.instagram.com/ng_hiee/",
};

// Function to update social media links
function updateSocialLinks() {
    // Update hero section social links
    const heroSocialLinks = document.querySelectorAll(".home-hero__social-icon-link");
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
    const footerSocialLinks = document.querySelectorAll(".main-footer__social-cont a");
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
