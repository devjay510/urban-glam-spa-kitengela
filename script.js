const siteConfig = {
    businessName: "Urban Glam Spa",
    phoneDisplay: "+254 700 055 093",
    phoneLink: "+254700055093",
    whatsappNumber: "254700055093",
    defaultMessage: "Hi, I'd like to book an appointment at Urban Glam Spa.",
    address: "Kitengela Milele Centre, behind Quickmart",
    hours: "8:00 AM - 9:30 PM"
};

const body = document.body;
const header = document.querySelector(".site-header");
const navToggle = document.getElementById("nav-toggle");
const siteNav = document.getElementById("site-nav");

const buildWhatsappLink = (message = siteConfig.defaultMessage) => {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodedMessage}`;
};

const applySiteConfig = () => {
    document.querySelectorAll("[data-business-name]").forEach((element) => {
        element.textContent = siteConfig.businessName;
    });

    document.querySelectorAll("[data-phone-display]").forEach((element) => {
        element.textContent = siteConfig.phoneDisplay;
    });

    document.querySelectorAll("[data-address]").forEach((element) => {
        element.textContent = siteConfig.address;
    });

    document.querySelectorAll("[data-hours]").forEach((element) => {
        element.textContent = siteConfig.hours;
    });

    document.querySelectorAll("[data-phone-link]").forEach((element) => {
        element.setAttribute("href", `tel:${siteConfig.phoneLink}`);
    });

    document.querySelectorAll("[data-whatsapp-link]").forEach((element) => {
        const message = element.dataset.whatsappMessage || siteConfig.defaultMessage;
        element.setAttribute("href", buildWhatsappLink(message));
    });

    const year = document.querySelector("[data-year]");
    if (year) {
        year.textContent = new Date().getFullYear();
    }
};

const setHeaderState = () => {
    if (!header) {
        return;
    }

    header.classList.toggle("is-scrolled", window.scrollY > 16);
};

const closeNav = () => {
    if (!navToggle || !siteNav) {
        return;
    }

    navToggle.classList.remove("is-active");
    navToggle.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
};

const initNavigation = () => {
    navToggle?.addEventListener("click", () => {
        const isOpen = navToggle.classList.toggle("is-active");
        navToggle.setAttribute("aria-expanded", String(isOpen));
        siteNav?.classList.toggle("is-open", isOpen);
    });

    siteNav?.querySelectorAll("a[href^='#']").forEach((link) => {
        link.addEventListener("click", closeNav);
    });

    window.addEventListener("scroll", setHeaderState, { passive: true });
    setHeaderState();
};

const initRevealObserver = () => {
    const revealItems = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window) || !revealItems.length) {
        revealItems.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries, revealObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
        });
    }, {
        threshold: 0.16,
        rootMargin: "0px 0px -40px 0px"
    });

    revealItems.forEach((item) => observer.observe(item));
};

const initGalleryFilters = () => {
    const filterButtons = document.querySelectorAll("[data-filter]");
    const galleryCards = document.querySelectorAll(".gallery-card");

    if (!filterButtons.length || !galleryCards.length) {
        return;
    }

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;

            filterButtons.forEach((item) => {
                const isActive = item === button;
                item.classList.toggle("is-active", isActive);
                item.setAttribute("aria-pressed", String(isActive));
            });

            galleryCards.forEach((card) => {
                const matches = filter === "all" || card.dataset.category === filter;
                card.hidden = !matches;
            });
        });
    });
};

const initLightbox = () => {
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const closeButton = document.getElementById("lightbox-close");
    const triggers = document.querySelectorAll(".gallery-button");
    const closeTriggers = document.querySelectorAll("[data-lightbox-close]");

    if (!lightbox || !lightboxImage || !lightboxCaption || !triggers.length) {
        return;
    }

    const closeLightbox = () => {
        lightbox.hidden = true;
        body.style.overflow = "";
    };

    triggers.forEach((trigger) => {
        trigger.addEventListener("click", () => {
            lightboxImage.src = trigger.dataset.image || "";
            lightboxImage.alt = trigger.querySelector("img")?.alt || "Gallery image";
            lightboxCaption.textContent = trigger.dataset.caption || "";
            lightbox.hidden = false;
            body.style.overflow = "hidden";
        });
    });

    closeTriggers.forEach((trigger) => {
        trigger.addEventListener("click", closeLightbox);
    });

    closeButton?.addEventListener("click", closeLightbox);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeNav();
            if (!lightbox.hidden) {
                closeLightbox();
            }
        }
    });
};

const initTestimonials = () => {
    const cards = Array.from(document.querySelectorAll("[data-testimonial]"));
    const dots = Array.from(document.querySelectorAll(".dot"));
    const prevButton = document.getElementById("testimonial-prev");
    const nextButton = document.getElementById("testimonial-next");
    const track = document.querySelector(".testimonial-track");

    if (!cards.length) {
        return;
    }

    let index = 0;
    let autoRotate;

    const syncTrackHeight = () => {
        if (!track) {
            return;
        }

        const activeCard = cards[index];
        if (!activeCard) {
            return;
        }

        track.style.height = `${activeCard.offsetHeight}px`;
    };

    const showSlide = (nextIndex) => {
        index = (nextIndex + cards.length) % cards.length;

        cards.forEach((card, cardIndex) => {
            card.classList.toggle("is-active", cardIndex === index);
        });

        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle("is-active", dotIndex === index);
        });

        syncTrackHeight();
    };

    const restartAutoRotate = () => {
        window.clearInterval(autoRotate);
        autoRotate = window.setInterval(() => {
            showSlide(index + 1);
        }, 6500);
    };

    prevButton?.addEventListener("click", () => {
        showSlide(index - 1);
        restartAutoRotate();
    });

    nextButton?.addEventListener("click", () => {
        showSlide(index + 1);
        restartAutoRotate();
    });

    dots.forEach((dot) => {
        dot.addEventListener("click", () => {
            showSlide(Number(dot.dataset.slide));
            restartAutoRotate();
        });
    });

    showSlide(index);
    restartAutoRotate();
    window.addEventListener("resize", syncTrackHeight);
};

const initBookingForm = () => {
    const form = document.getElementById("booking-form");
    const bookingDate = document.getElementById("booking-date");
    const bookingTime = document.getElementById("booking-time");

    const normaliseBookingDate = (value) => {
        const isoMatch = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (isoMatch) {
            return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`;
        }

        return value;
    };

    const formatDateDigits = (value) => {
        const normalisedValue = normaliseBookingDate(value);
        const digits = normalisedValue.replace(/\D/g, "").slice(0, 8);

        if (digits.length <= 2) {
            return digits;
        }

        if (digits.length <= 4) {
            return `${digits.slice(0, 2)}/${digits.slice(2)}`;
        }

        return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    };

    const parseBookingDate = (value) => {
        const match = normaliseBookingDate(value).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (!match) {
            return null;
        }

        const day = Number(match[1]);
        const month = Number(match[2]);
        const year = Number(match[3]);
        const date = new Date(year, month - 1, day);

        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
        ) {
            return null;
        }

        date.setHours(0, 0, 0, 0);
        return date;
    };

    const validateBookingDate = () => {
        if (!bookingDate) {
            return true;
        }

        const value = bookingDate.value.trim();
        if (!value) {
            bookingDate.setCustomValidity("");
            return true;
        }

        bookingDate.value = normaliseBookingDate(value);
        const parsedDate = parseBookingDate(value);
        if (!parsedDate) {
            bookingDate.setCustomValidity("Please use dd/mm/yyyy.");
            return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (parsedDate < today) {
            bookingDate.setCustomValidity("Please choose today or a future date.");
            return false;
        }

        bookingDate.setCustomValidity("");
        return true;
    };

    const formatBookingTime = (value) => {
        const match = value.match(/^(\d{2}):(\d{2})$/);
        if (!match) {
            return value;
        }

        const hours = Number(match[1]);
        const minutes = match[2];
        const meridiem = hours >= 12 ? "PM" : "AM";
        const twelveHour = hours % 12 || 12;

        return `${String(twelveHour).padStart(2, "0")}:${minutes} ${meridiem}`;
    };

    if (bookingDate) {
        bookingDate.addEventListener("input", () => {
            bookingDate.value = formatDateDigits(bookingDate.value);
            bookingDate.setCustomValidity("");
        });

        bookingDate.addEventListener("blur", () => {
            validateBookingDate();
            bookingDate.reportValidity();
        });
    }

    if (bookingTime) {
        bookingTime.addEventListener("input", () => {
            bookingTime.setCustomValidity("");
        });
    }

    form?.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!validateBookingDate()) {
            bookingDate?.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const name = formData.get("name")?.toString().trim();
        const service = formData.get("service")?.toString().trim();
        const date = normaliseBookingDate(formData.get("date")?.toString().trim() || "");
        const time = formData.get("time")?.toString().trim();
        const contact = formData.get("contact")?.toString().trim();
        const notes = formData.get("notes")?.toString().trim();

        const message = [
            siteConfig.defaultMessage,
            "",
            `Name: ${name || "-"}`,
            `Service: ${service || "-"}`,
            `Preferred date: ${date || "Flexible"}`,
            `Preferred time: ${formatBookingTime(time || "") || "Flexible"}`,
            `Contact: ${contact || "-"}`,
            `Notes: ${notes || "None"}`
        ].join("\n");

        window.open(buildWhatsappLink(message), "_blank", "noopener");
    });
};

applySiteConfig();
initNavigation();
initRevealObserver();
initGalleryFilters();
initLightbox();
initTestimonials();
initBookingForm();
