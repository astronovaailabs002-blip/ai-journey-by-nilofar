const app = {
    init() {
        this.cache();
        this.bindLoader();
        this.bindNavigation();
        this.bindScrollEffects();
        this.bindReveal();
        this.bindCursorGlow();
        this.updateOnScroll();
    },

    cache() {
        this.body = document.body;
        this.header = document.querySelector(".site-header");
        this.loader = document.querySelector(".loader");
        this.progress = document.querySelector(".scroll-progress");
        this.cursorGlow = document.querySelector(".cursor-glow");
        this.navToggle = document.querySelector(".nav-toggle");
        this.navMenu = document.querySelector(".nav-menu");
        this.navLinks = document.querySelectorAll(".nav-menu a");
        this.revealItems = document.querySelectorAll(".reveal");
        this.backToTop = document.querySelector(".back-to-top");
        this.currentPage = this.body.dataset.page;
        this.scrollTicking = false;
        this.prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    },

    bindLoader() {
        window.addEventListener("load", () => {
            if (this.loader) {
                this.loader.classList.add("is-hidden");
            }
        });
    },

    closeMenu() {
        if (!this.navToggle || !this.navMenu) {
            return;
        }

        this.navToggle.setAttribute("aria-expanded", "false");
        this.navMenu.classList.remove("is-open");
        this.body.classList.remove("nav-open");
    },

    bindNavigation() {
        if (this.navToggle && this.navMenu) {
            this.navToggle.addEventListener("click", () => {
                const isOpen = this.navToggle.getAttribute("aria-expanded") === "true";
                this.navToggle.setAttribute("aria-expanded", String(!isOpen));
                this.navMenu.classList.toggle("is-open", !isOpen);
                this.body.classList.toggle("nav-open", !isOpen);
            });
        }

        this.navLinks.forEach((link) => {
            if (link.dataset.nav === this.currentPage) {
                link.classList.add("is-active");
                link.setAttribute("aria-current", "page");
            }

            link.addEventListener("click", () => this.closeMenu());
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                this.closeMenu();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth >= 940) {
                this.closeMenu();
            }
        });
    },

    bindScrollEffects() {
        window.addEventListener("scroll", () => this.requestScrollUpdate(), { passive: true });

        if (this.backToTop) {
            this.backToTop.addEventListener("click", () => {
                window.scrollTo({ top: 0, behavior: this.prefersReducedMotion ? "auto" : "smooth" });
            });
        }
    },

    requestScrollUpdate() {
        if (this.scrollTicking) {
            return;
        }

        this.scrollTicking = true;
        window.requestAnimationFrame(() => {
            this.updateOnScroll();
            this.scrollTicking = false;
        });
    },

    updateOnScroll() {
        const scrollTop = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

        if (this.header) {
            this.header.classList.toggle("scrolled", scrollTop > 16);
        }

        if (this.backToTop) {
            this.backToTop.classList.toggle("is-visible", scrollTop > 440);
        }

        if (this.progress) {
            this.progress.style.transform = `scaleX(${progress / 100})`;
        }
    },

    bindReveal() {
        if (!("IntersectionObserver" in window)) {
            this.revealItems.forEach((item) => item.classList.add("is-visible"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.14, rootMargin: "0px 0px -44px 0px" }
        );

        this.revealItems.forEach((item) => observer.observe(item));
    },

    bindCursorGlow() {
        if (!this.cursorGlow || window.matchMedia("(pointer: coarse)").matches) {
            return;
        }

        window.addEventListener("pointermove", (event) => {
            this.cursorGlow.style.opacity = "1";
            this.cursorGlow.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
        });

        window.addEventListener("pointerleave", () => {
            this.cursorGlow.style.opacity = "0";
        });
    }
};

document.addEventListener("DOMContentLoaded", () => app.init());
