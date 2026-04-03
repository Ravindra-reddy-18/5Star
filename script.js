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
const ageYes = document.getElementById("age-yes");
const ageNo = document.getElementById("age-no");

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

if (ageGate && ageYes && ageNo) {
  const alreadyVerified = localStorage.getItem("ageVerified") === "true";

  if (alreadyVerified) {
    closeAgeGate();
  } else {
    openAgeGate();
  }

  ageYes.addEventListener("click", () => {
    localStorage.setItem("ageVerified", "true");
    closeAgeGate();
  });

  ageNo.addEventListener("click", () => {
    window.location.href = "https://www.google.com";
  });
}