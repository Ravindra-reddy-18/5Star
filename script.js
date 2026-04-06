const buttons = document.querySelectorAll(".carousel-btn, .featured-btn");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const trackName = button.dataset.carousel;
    const direction = button.dataset.direction;

    const track = document.querySelector(
      `[data-carousel-track="${trackName}"]`
    );

    if (!track) return;

    // Featured should move 1 full slide; others can move 70% width
    const isFeatured = trackName === "featured";
    const scrollAmount = isFeatured ? track.clientWidth : track.clientWidth * 0.7;

    track.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  });
});
const featuredTrack = document.querySelector(
  '[data-carousel-track="featured"]'
);

if (featuredTrack) {
  let autoSlideInterval;
  let currentIndex = 0;

  const slides = featuredTrack.children;
  const totalSlides = slides.length;

  function goToSlide(index) {
    featuredTrack.scrollTo({
      left: featuredTrack.clientWidth * index,
      behavior: "smooth",
    });
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      currentIndex++;

      if (currentIndex >= totalSlides) {
        currentIndex = 0; // loop back to start
      }

      goToSlide(currentIndex);
    }, 3000); // change speed here (6000ms = 6s)
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // Pause on hover
  featuredTrack.addEventListener("mouseenter", stopAutoSlide);
  featuredTrack.addEventListener("mouseleave", startAutoSlide);

  // Start autoplay
  startAutoSlide();
}
const ageGate = document.getElementById("age-gate");
const dobInput = document.getElementById("dob");
const enterSiteBtn = document.getElementById("enter-site");
const ageNoBtn = document.getElementById("age-no");
const ageError = document.getElementById("age-error");

function setMaxDobToToday() {
  if (!dobInput) return;
  const today = new Date().toISOString().split("T")[0];
  dobInput.max = today;
}

function calculateAge(dobString) {
  const today = new Date();
  const dob = new Date(dobString);

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}

function openAgeGate() {
  if (!ageGate) return;
  document.body.classList.add("age-gate-open");
  ageGate.classList.remove("hidden");
}

function closeAgeGate() {
  if (!ageGate) return;
  document.body.classList.remove("age-gate-open");
  ageGate.classList.add("hidden");
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

  if (age >= 21) {
    enterSiteBtn.disabled = false;
    ageError.textContent = "";
  } else {
    enterSiteBtn.disabled = true;
    ageError.textContent = "You must be 21 or older to enter.";
  }
}

if (ageGate && dobInput && enterSiteBtn && ageNoBtn && ageError) {
  setMaxDobToToday();

  const alreadyVerified = localStorage.getItem("ageVerified") === "true";

  if (alreadyVerified) {
    closeAgeGate();
  } else {
    openAgeGate();
  }

  dobInput.addEventListener("input", validateDob);
  dobInput.addEventListener("change", validateDob);

  enterSiteBtn.addEventListener("click", () => {
    if (enterSiteBtn.disabled) return;
    localStorage.setItem("ageVerified", "true");
    closeAgeGate();
  });

  ageNoBtn.addEventListener("click", () => {
    window.location.href = "https://www.google.com";
  });
}
const consentCheck = document.getElementById("sms-consent-check");
const smsJoinBtn = document.getElementById("sms-join-btn");

if (consentCheck && smsJoinBtn) {
  consentCheck.addEventListener("change", () => {
    const isChecked = consentCheck.checked;

    smsJoinBtn.classList.toggle("cta-disabled", !isChecked);
    smsJoinBtn.setAttribute("aria-disabled", String(!isChecked));
  });
}