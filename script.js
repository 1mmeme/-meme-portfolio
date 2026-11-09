
/* =====================================
   ∑eme! — INTERACTIVE PORTFOLIO
===================================== */

/* ELEMENTS */

const filterButtons =
    document.querySelectorAll(".filter-btn");

const workItems = Array.from(
    document.querySelectorAll(".work-item")
);

const lightbox =
    document.getElementById("lightbox");

const lightboxImage =
    document.getElementById("lightbox-image");

const lightboxCaption =
    document.getElementById("lightbox-caption");

const lightboxCounter =
    document.getElementById("lightbox-counter");

const closeButton =
    document.getElementById("lightbox-close");

const prevButton =
    document.getElementById("lightbox-prev");

const nextButton =
    document.getElementById("lightbox-next");

let visibleImages = [];
let currentIndex = 0;
let lastFocusedElement = null;

/* =====================================
   FILTER
===================================== */

function updateVisibleImages() {
    visibleImages = workItems
        .filter(item => !item.hidden)
        .map(item => item.querySelector("img"));
}

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        const filter = button.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        workItems.forEach(item => {

            const show =
                filter === "all" ||
                item.dataset.category === filter;

            item.hidden = !show;
        });

        updateVisibleImages();
        revealVisibleWorks();
    });
});

/* =====================================
   LIGHTBOX
===================================== */

function formatNumber(number) {
    return String(number).padStart(2, "0");
}

function showImage() {

    if (visibleImages.length === 0) return;

    const image = visibleImages[currentIndex];

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;

    lightboxCaption.textContent = image.alt;

    /* 作品番号を自動更新 */

    lightboxCounter.textContent =
        `${formatNumber(currentIndex + 1)} / ` +
        `${formatNumber(visibleImages.length)}`;

    lightbox.classList.add("active");

    document.body.style.overflow = "hidden";
}

workItems.forEach(item => {

    const image = item.querySelector("img");

    image.addEventListener("click", () => {

        updateVisibleImages();

        currentIndex =
            visibleImages.indexOf(image);

        if (currentIndex !== -1) {
            lastFocusedElement =
                document.activeElement;

            showImage();
            closeButton.focus();
        }
    });
});

function closeLightbox() {

    lightbox.classList.remove("active");

    document.body.style.overflow = "";

    if (lastFocusedElement &&
        typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
    }
}

function showPrev() {

    if (visibleImages.length === 0) return;

    currentIndex =
        (currentIndex - 1 + visibleImages.length)
        % visibleImages.length;

    showImage();
}

function showNext() {

    if (visibleImages.length === 0) return;

    currentIndex =
        (currentIndex + 1)
        % visibleImages.length;

    showImage();
}

/* LIGHTBOX BUTTONS */

closeButton.addEventListener(
    "click",
    closeLightbox
);

prevButton.addEventListener(
    "click",
    showPrev
);

nextButton.addEventListener(
    "click",
    showNext
);

/* 背景クリックで閉じる */

lightbox.addEventListener("click", event => {

    if (event.target === lightbox) {
        closeLightbox();
    }
});

/* KEYBOARD */

document.addEventListener("keydown", event => {

    if (!lightbox.classList.contains("active")) {
        return;
    }

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowLeft") {
        showPrev();
    }

    if (event.key === "ArrowRight") {
        showNext();
    }

    /* Tabキーを拡大画面の中に留める */

    if (event.key === "Tab") {

        const buttons = [
            closeButton,
            prevButton,
            nextButton
        ];

        const current =
            buttons.indexOf(document.activeElement);

        if (event.shiftKey && current <= 0) {
            event.preventDefault();
            nextButton.focus();
        } else if (!event.shiftKey &&
                   current === buttons.length - 1) {
            event.preventDefault();
            closeButton.focus();
        }
    }
});

/* =====================================
   SCROLL REVEAL
===================================== */

const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

const revealObserver =
    !reduceMotion &&
    "IntersectionObserver" in window
        ? new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "is-visible"
                        );

                        revealObserver.unobserve(
                            entry.target
                        );
                    }
                });
            },
            {
                threshold: 0.08,
                rootMargin: "0px 0px 70px 0px"
            }
        )
        : null;

function revealVisibleWorks() {

    workItems.forEach((item, index) => {

        if (item.hidden) return;

        if (!revealObserver) {
            item.classList.add("is-visible");
            return;
        }

        item.style.setProperty(
            "--reveal-delay",
            `${(index % 2) * 120}ms`
        );

        revealObserver.observe(item);
    });
}

/* =====================================
   MOUSE PARALLAX
===================================== */

const hero = document.querySelector(".hero");

const parallaxItems = [
    {
        element: document.querySelector(".decor-sigma"),
        strength: 18
    },
    {
        element: document.querySelector(".decor-circle"),
        strength: -24
    },
    {
        element: document.querySelector(".decor-star"),
        strength: 35
    },
    {
        element: document.querySelector(".decor-sticker"),
        strength: -16
    }
];

if (
    hero &&
    !reduceMotion &&
    window.matchMedia("(pointer: fine)").matches
) {

    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;

    let animationFrame = null;

    function animateParallax() {

        currentX += (targetX - currentX) * 0.07;
        currentY += (targetY - currentY) * 0.07;

        parallaxItems.forEach(item => {

            if (!item.element) return;

            const x = currentX * item.strength;
            const y = currentY * item.strength;

            item.element.style.setProperty(
                "--mouse-x",
                `${x}px`
            );

            item.element.style.setProperty(
                "--mouse-y",
                `${y}px`
            );
        });

        const moving =
            Math.abs(targetX - currentX) > 0.001 ||
            Math.abs(targetY - currentY) > 0.001;

        if (moving) {

            animationFrame =
                requestAnimationFrame(animateParallax);

        } else {
            animationFrame = null;
        }
    }

    function startParallax() {

        if (animationFrame === null) {

            animationFrame =
                requestAnimationFrame(animateParallax);
        }
    }

    hero.addEventListener("pointermove", event => {

        const rect = hero.getBoundingClientRect();

        targetX =
            ((event.clientX - rect.left) / rect.width)
            * 2 - 1;

        targetY =
            ((event.clientY - rect.top) / rect.height)
            * 2 - 1;

        startParallax();
    });

    hero.addEventListener("pointerleave", () => {

        targetX = 0;
        targetY = 0;

        startParallax();
    });
}

/* =====================================
   INITIALIZE
===================================== */

updateVisibleImages();
revealVisibleWorks();
