(() => {
    "use strict";

    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


    // ================= LOADER =================
    // Hides after a short moment instead of waiting for every image to finish loading.

    const loader = $(".loader");

    if (loader) {
        setTimeout(() => loader.classList.add("hide"), 700);
        loader.addEventListener("transitionend", () => loader.remove(), { once: true });
    }


    // ================= THEME =================

    const themeBtn = $("#theme-toggle");

    const applyTheme = (theme) => {
        root.setAttribute("data-theme", theme);
        if (themeBtn) {
            themeBtn.setAttribute(
                "aria-label",
                theme === "light" ? "Switch to dark theme" : "Switch to light theme"
            );
        }
    };

    applyTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark");

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
            applyTheme(next);
            try { localStorage.setItem("theme", next); } catch (e) { /* storage unavailable */ }
        });
    }


    // ================= MOBILE MENU =================

    const menuBtn = $("#menu-btn");
    const navbar = $("#navbar");

    const setMenu = (open) => {
        if (!menuBtn || !navbar) return;
        navbar.classList.toggle("open", open);
        menuBtn.setAttribute("aria-expanded", String(open));
        menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        const icon = $("i", menuBtn);
        if (icon) {
            icon.classList.toggle("fa-bars", !open);
            icon.classList.toggle("fa-xmark", open);
        }
    };

    if (menuBtn && navbar) {
        menuBtn.addEventListener("click", () => setMenu(!navbar.classList.contains("open")));

        // close when a link is chosen
        $$("a", navbar).forEach((link) => link.addEventListener("click", () => setMenu(false)));

        // close with Escape or when tapping outside
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") setMenu(false);
        });

        document.addEventListener("click", (e) => {
            if (!navbar.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 992) setMenu(false);
        });
    }


    // ================= HEADER + BACK TO TOP =================

    const header = $("#header");
    const backTop = $("#back-top");

    const onScroll = () => {
        const y = window.scrollY;
        if (header) header.classList.toggle("scrolled", y > 10);
        if (backTop) backTop.classList.toggle("show", y > 400);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (backTop) {
        backTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
        });
    }


    // ================= ACTIVE NAV LINK =================

    const sections = $$("main section[id]");
    const navLinks = $$("a", navbar || document.body).filter((a) => a.hash);

    if ("IntersectionObserver" in window && sections.length) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                navLinks.forEach((link) => {
                    link.classList.toggle("active", link.hash === `#${entry.target.id}`);
                });
            });
        }, { rootMargin: "-45% 0px -50% 0px" });

        sections.forEach((section) => navObserver.observe(section));
    }


    // ================= SKILL BARS =================

    const skills = $(".skills");

    if (skills) {
        if ("IntersectionObserver" in window) {
            const skillObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        skills.classList.add("in-view");
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.25 });

            skillObserver.observe(skills);
        } else {
            skills.classList.add("in-view");
        }
    }


    // ================= TYPING EFFECT =================

    const typingEl = $("#typing");

    if (typingEl && !reduceMotion) {
        const words = ["Front-End Developer", "Web Designer", "JavaScript Developer"];
        let wordIndex = 0;
        let charIndex = words[0].length;
        let deleting = true;

        const tick = () => {
            const word = words[wordIndex];

            typingEl.textContent = word.slice(0, charIndex);

            let delay = deleting ? 45 : 90;

            if (!deleting && charIndex === word.length) {
                deleting = true;
                delay = 1600;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                delay = 300;
            } else {
                charIndex += deleting ? -1 : 1;
            }

            setTimeout(tick, delay);
        };

        // first word is already visible; wait, then start cycling
        setTimeout(tick, 1800);
    }


    // ================= CERTIFICATE VIEWER =================

    const lightbox = $("#lightbox");

    if (lightbox && typeof lightbox.showModal === "function") {
        const lightboxImg = $("img", lightbox);
        const lightboxCaption = $(".lightbox-caption", lightbox);

        $$(".certificate-card").forEach((card) => {
            card.addEventListener("click", () => {
                lightboxImg.src = card.dataset.src;
                lightboxImg.alt = card.dataset.title;
                lightboxCaption.textContent = card.dataset.title;
                lightbox.showModal();
            });
        });

        $(".lightbox-close", lightbox).addEventListener("click", () => lightbox.close());

        // click on the dark backdrop closes it
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) lightbox.close();
        });
    } else {
        // very old browsers: open the image in a new tab instead
        $$(".certificate-card").forEach((card) => {
            card.addEventListener("click", () => window.open(card.dataset.src, "_blank", "noopener"));
        });
    }


    // ================= FOOTER YEAR =================

    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();

})();
