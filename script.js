const FEATURED_AUTOPLAY_MS = 3000;
const FEATURED_TRACK_SELECTOR = '[data-carousel-track="featured"]';
const CAROUSEL_BUTTON_SELECTOR = ".carousel-btn, .featured-btn";
const AGE_VERIFIED_KEY = "ageVerified";
const SIMPLETEXTING_FORM_ID = "69d502d57f9323676e68a7f7";
const SIMPLETEXTING_DUPLICATE_EMAIL = "DuplicateContactEmailException";
const SIMPLETEXTING_DUPLICATE_PHONE = "DuplicateContactPhoneException";
const SIMPLETEXTING_CUSTOM_FIELDS_ERROR = "CustomFieldsValidationException";

const ageGate = document.getElementById("age-gate");
const dobInput = document.getElementById("dob");
const enterSiteBtn = document.getElementById("enter-site");
const ageNoBtn = document.getElementById("age-no");
const ageError = document.getElementById("age-error");

function getCarouselTrack(trackName) {
  return document.querySelector(`[data-carousel-track="${trackName}"]`);
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

function initSmsSignupForm() {
  const form = document.getElementById(`st-join-web-form-${SIMPLETEXTING_FORM_ID}`);

  if (!form) return;

  const phoneField = form.querySelector('input[name="phone"]');
  const termsField = form.querySelector('input[name="terms-agreed"]');
  const submitButton = form.querySelector("#subscribeNow");
  const stepOne = form.querySelector(".step1-form");
  const confirmationText = form.querySelector(".step2-confirmationText");
  const fieldError = form.querySelector("#js-error-phone");
  const termsError = form.querySelector(".st-signupform-terms-agreed-error");
  const serverError = form.querySelector(".st-signupform-server-error-message");

  if (!phoneField || !termsField || !submitButton || !stepOne || !confirmationText) return;

  function formatPhone(value) {
    const numbers = value.replace(/\D/g, "").slice(0, 10);
    const first = numbers.substring(0, 3);
    const second = numbers.substring(3, 6);
    const third = numbers.substring(6, 10);

    let formatted = "";

    if (first) formatted += `(${first}`;
    if (second) formatted += `) ${second}`;
    if (third) formatted += `-${third}`;

    return formatted;
  }

  function clearErrors() {
    phoneField.classList.remove("st-signupform-validation-error");
    fieldError.textContent = "";
    termsError.classList.add("st-hidden");
    serverError.textContent = "";
    serverError.classList.add("st-hidden");
  }

  function showServerError(message) {
    serverError.textContent = message;
    serverError.classList.remove("st-hidden");
  }

  function collectFormData() {
    return {
      webFormId: SIMPLETEXTING_FORM_ID,
      fieldValues: {
        phone: phoneField.value.replace(/\D/g, ""),
      },
      listIds: [],
    };
  }

  function convertValidationMessage(code, response) {
    if (code === SIMPLETEXTING_DUPLICATE_PHONE) {
      return "This phone number is already subscribed.";
    }

    if (code === SIMPLETEXTING_DUPLICATE_EMAIL) {
      return "This email is already subscribed.";
    }

    if (code === SIMPLETEXTING_CUSTOM_FIELDS_ERROR) {
      return "Please check your form details and try again.";
    }

    if (response?.reason === "Required field value is empty") {
      return "Phone is required.";
    }

    return "Phone is required in (XXX) XXX-XXXX format.";
  }

  phoneField.addEventListener("input", () => {
    phoneField.value = formatPhone(phoneField.value);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearErrors();
    submitButton.disabled = true;

    if (!termsField.checked) {
      termsError.classList.remove("st-hidden");
      submitButton.disabled = false;
      return;
    }

    if (phoneField.value.replace(/\D/g, "").length !== 10) {
      phoneField.classList.add("st-signupform-validation-error");
      fieldError.textContent = "Phone is required in (XXX) XXX-XXXX format.";
      submitButton.disabled = false;
      return;
    }

    try {
      const response = await fetch(`${form.action}?r=${Date.now()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(collectFormData()),
      });

      if (response.ok) {
        confirmationText.innerHTML = `
          <p>
            Just one more step. We sent a text to ${phoneField.value} to confirm your subscription.
            Please reply Y or Yes to finish signing up for messages from Five Star Liquor.
          </p>
        `;
        stepOne.classList.add("st-hidden");
        confirmationText.classList.remove("st-hidden");
        form.reset();
        return;
      }

      if (response.status === 418) {
        const payload = await response.json().catch(() => null);
        const message = convertValidationMessage(payload?.code, payload);

        if (payload?.invalidValueName === "phone" || payload?.code === SIMPLETEXTING_DUPLICATE_PHONE) {
          phoneField.classList.add("st-signupform-validation-error");
          fieldError.textContent = message;
        } else {
          showServerError(message);
        }
      } else {
        showServerError("Internal error. Please try again later.");
      }
    } catch (error) {
      showServerError("Internal error. Please try again later.");
    } finally {
      submitButton.disabled = false;
    }
  });
}

function reorderHomepageSections() {
  const bourbonSection = document.getElementById("allocations");
  const craftBeerSection = document.getElementById("craft-beers");

  if (!bourbonSection || !craftBeerSection) return;

  const nextSection = bourbonSection.nextElementSibling;

  if (nextSection !== craftBeerSection) {
    bourbonSection.insertAdjacentElement("afterend", craftBeerSection);
  }
}

reorderHomepageSections();
initCarousels();
initFeaturedAutoplay();
initAgeGate();
initSmsSignupForm();
