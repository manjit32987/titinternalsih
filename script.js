/**
 * TIT IIC - SIH INTERNAL HACKATHON 2026
 * Interactive & Dynamic Logic Engine
 */

// Global Configuration
const CONFIG = {
  googleFormUrl: "https://forms.gle/sampleGoogleFormTITSIH2026", // Replace with your actual Google Form URL
  hackathonDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
  registrationDeadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000) // 6 days from now
};

// Initialize Everything on DOM Load
document.addEventListener("DOMContentLoaded", () => {
  initCountdownTimer();
  init3DCardTilt();
  initFaqAccordion();
  initScrollEffects();
  initRegistrationModal();
  initConfettiTriggers();
});

/* ==========================================================================
   1. LIVE COUNTDOWN TIMER ENGINE
   ========================================================================== */
function initCountdownTimer() {
  const daysEl = document.getElementById("timer-days");
  const hoursEl = document.getElementById("timer-hours");
  const minutesEl = document.getElementById("timer-minutes");
  const secondsEl = document.getElementById("timer-seconds");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function updateTimer() {
    const now = new Date().getTime();
    const target = CONFIG.registrationDeadline.getTime();
    const difference = target - now;

    if (difference <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   2. VANILLA 3D CARD TILT ENGINE
   ========================================================================== */
function init3DCardTilt() {
  const tiltElements = document.querySelectorAll("[data-tilt]");

  tiltElements.forEach((el) => {
    if (el._tiltInitialized) return;
    el._tiltInitialized = true;

    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    });
  });
}

/* ==========================================================================
   3. FAQ ACCORDION ENGINE
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector(".faq-question");
    const answerEl = item.querySelector(".faq-answer");

    if (!questionBtn || !answerEl) return;

    questionBtn.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach((otherItem) => {
        otherItem.classList.remove("active");
        const otherAnswer = otherItem.querySelector(".faq-answer");
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add("active");
        answerEl.style.maxHeight = answerEl.scrollHeight + "px";
      } else {
        item.classList.remove("active");
        answerEl.style.maxHeight = null;
      }
    });
  });
}

/* ==========================================================================
   4. REGISTRATION REDIRECTION & MODAL SYSTEM
   ========================================================================== */
function initRegistrationModal() {
  const regModal = document.getElementById("registration-confirm-modal");
  const modalClose = document.getElementById("reg-modal-close");
  const directLaunchBtn = document.getElementById("btn-direct-launch-form");

  window.triggerRegistration = (psId = "") => {
    if (regModal) {
      regModal.classList.add("active");
    } else {
      window.open(CONFIG.googleFormUrl, "_blank");
    }
  };

  window.closeRegistrationModal = () => {
    if (regModal) regModal.classList.remove("active");
  };

  if (modalClose) {
    modalClose.addEventListener("click", window.closeRegistrationModal);
  }

  if (directLaunchBtn) {
    directLaunchBtn.addEventListener("click", () => {
      triggerConfettiBurst();
      window.open(CONFIG.googleFormUrl, "_blank");
      window.closeRegistrationModal();
    });
  }
}

/* ==========================================================================
   5. SCROLL REVEAL & STICKY DOCK & MOBILE NAV
   ========================================================================== */
function initScrollEffects() {
  const floatingDock = document.getElementById("floating-reg-dock");

  window.addEventListener("scroll", () => {
    if (!floatingDock) return;
    if (window.scrollY > 450) {
      floatingDock.classList.add("visible");
    } else {
      floatingDock.classList.remove("visible");
    }
  });

  // Mobile menu toggle
  const mobileBtn = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-nav-dropdown");

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
    });
  }

  window.closeMobileMenu = () => {
    if (mobileMenu) mobileMenu.classList.remove("open");
  };
}

/* ==========================================================================
   6. CELEBRATORY CONFETTI ENGINE
   ========================================================================== */
function initConfettiTriggers() {
  const grandPrizeCard = document.getElementById("grand-prize-card");
  
  if (grandPrizeCard) {
    grandPrizeCard.addEventListener("click", () => {
      triggerConfettiBurst();
    });
  }
}

function triggerConfettiBurst(colorMix) {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

/* ==========================================================================
   7. DOWNLOAD PPT TEMPLATE TRIGGER
   ========================================================================== */
window.downloadPptTemplate = () => {
  const link = document.createElement("a");
  link.href = "SIH2026-IDEA-Presentation-Format.pptx";
  link.setAttribute("download", "SIH2026-IDEA-Presentation-Format.pptx");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  triggerConfettiBurst();
};
