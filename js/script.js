const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const revealItems = document.querySelectorAll(".reveal");
const backToTop = document.querySelector(".back-to-top");
const currentPage = document.body.dataset.page;

const closeMenu = () => {
    if (!navToggle || !navMenu) {
        return;
    }

    navToggle.setAttribute("aria-expanded", "false");
    navMenu.classList.remove("is-open");
    document.body.classList.remove("nav-open");
};

if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
        const isOpen = navToggle.getAttribute("aria-expanded") === "true";
        navToggle.setAttribute("aria-expanded", String(!isOpen));
        navMenu.classList.toggle("is-open", !isOpen);
        document.body.classList.toggle("nav-open", !isOpen);
    });
}

navLinks.forEach((link) => {
    if (link.dataset.nav === currentPage) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
    }

    link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

const updateChrome = () => {
    const isScrolled = window.scrollY > 16;

    if (header) {
        header.classList.toggle("scrolled", isScrolled);
    }

    if (backToTop) {
        backToTop.classList.toggle("is-visible", window.scrollY > 440);
    }
};

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.14,
            rootMargin: "0px 0px -44px 0px"
        }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (backToTop) {
    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

window.addEventListener("scroll", updateChrome, { passive: true });
window.addEventListener("resize", () => {
    if (window.innerWidth >= 920) {
        closeMenu();
    }
});

updateChrome();
