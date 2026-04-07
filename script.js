const FEATURED_AUTOPLAY_MS = 3000;
const FEATURED_TRACK_SELECTOR = '[data-carousel-track="featured"]';
const CAROUSEL_BUTTON_SELECTOR = ".carousel-btn, .featured-btn";
const AGE_VERIFIED_KEY = "ageVerified";

const ageGate = document.getElementById("age-gate");
const dobInput = document.getElementById("dob");
const enterSiteBtn = document.getElementById("enter-site");
const ageNoBtn = document.getElementById("age-no");
const ageError = document.getElementById("age-error");
const consentCheck = document.getElementById("sms-consent-check");
const smsJoinBtn = document.getElementById("sms-join-btn");

function getCarouselTrack(trackName) {
  return document.querySelector(`[data-carousel-track="${trackName}"]`);
}

function updateSmsJoinState(isEnabled) {
  if (!smsJoinBtn) return;

  smsJoinBtn.classList.toggle("cta-disabled", !isEnabled);
  smsJoinBtn.setAttribute("aria-disabled", String(!isEnabled));
}

function initCarousels() {
  const buttons = document.querySelectorAll(CAROUSEL_BUTTON_SELECTOR);

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const { carousel: trackName, direction } = button.dataset;
      const track = getCarouselTrack(trackName);

      if (!track) return;

      const scrollAmount =
        trackName === "featured" ? track.clientWidth : track.clientWidth * 0.7;

      track.scrollBy({
        left: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    });
  });
}

function initFeaturedAutoplay() {
  const featuredTrack = document.querySelector(FEATURED_TRACK_SELECTOR);

  if (!featuredTrack || featuredTrack.children.length < 2) return;

  let autoSlideInterval = null;
  let currentIndex = 0;
  const totalSlides = featuredTrack.children.length;

  function goToSlide(index) {
    featuredTrack.scrollTo({
      left: featuredTrack.clientWidth * index,
      behavior: "smooth",
    });
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = null;
  }

  function startAutoSlide() {
    stopAutoSlide();

    autoSlideInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % totalSlides;
      goToSlide(currentIndex);
    }, FEATURED_AUTOPLAY_MS);
  }

  featuredTrack.addEventListener("mouseenter", stopAutoSlide);
  featuredTrack.addEventListener("mouseleave", startAutoSlide);
  window.addEventListener("blur", stopAutoSlide);
  window.addEventListener("focus", startAutoSlide);

  startAutoSlide();
}

function setMaxDobToToday() {
  if (!dobInput) return;
  dobInput.max = new Date().toISOString().split("T")[0];
}

function calculateAge(dobString) {
  const today = new Date();
  const dob = new Date(dobString);

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return age;
}

function setAgeGateOpen(isOpen) {
  if (!ageGate) return;

  document.body.classList.toggle("age-gate-open", isOpen);
  ageGate.classList.toggle("hidden", !isOpen);
}

function validateDob() {
  if (!dobInput || !enterSiteBtn || !ageError) return;

  const value = dobInput.value;

  if (!value) {
    enterSiteBtn.disabled = true;
    ageError.textContent = "";
    return;
  }

  const age = calculateAge(value);

  if (Number.isNaN(age)) {
    enterSiteBtn.disabled = true;
    ageError.textContent = "Please enter a valid date of birth.";
    return;
  }

  const isOfAge = age >= 21;
  enterSiteBtn.disabled = !isOfAge;
  ageError.textContent = isOfAge ? "" : "You must be 21 or older to enter.";
}

function initAgeGate() {
  if (!ageGate || !dobInput || !enterSiteBtn || !ageNoBtn || !ageError) return;

  setMaxDobToToday();
  setAgeGateOpen(localStorage.getItem(AGE_VERIFIED_KEY) !== "true");

  dobInput.addEventListener("input", validateDob);
  dobInput.addEventListener("change", validateDob);

  enterSiteBtn.addEventListener("click", () => {
    if (enterSiteBtn.disabled) return;

    localStorage.setItem(AGE_VERIFIED_KEY, "true");
    setAgeGateOpen(false);
  });

  ageNoBtn.addEventListener("click", () => {
    window.location.href = "https://www.google.com";
  });
}

function initSmsConsent() {
  if (!consentCheck || !smsJoinBtn) return;

  updateSmsJoinState(consentCheck.checked);

  consentCheck.addEventListener("change", () => {
    updateSmsJoinState(consentCheck.checked);
  });
}

initCarousels();
initFeaturedAutoplay();
initAgeGate();
initSmsConsent();
