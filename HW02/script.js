// ========= Slider =========
const images = ["imgs/smile01.jpeg", "imgs/smile02.jpeg", "imgs/smile03.jpeg"]; // 320x320 images
let currentIndex = 0;
let intervalTimer;

const imageContainer = document.querySelector(".images");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const dots = document.querySelectorAll(".dots li");

function updateSlider() {
  // Change the image
  imageContainer.innerHTML = `<img src="${images[currentIndex]}" alt="Image ${
    currentIndex + 1
  }">`;

  // Update the dots
  dots.forEach((dot, index) => {
    dot.style.color = index === currentIndex ? "grey" : "white";
  });

  resetInterval();
}

function showPrevImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateSlider();
}

function showNextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  console.log(currentIndex);
  updateSlider();
}

function goToImage(index) {
  currentIndex = index;
  updateSlider();
}

function resetInterval() {
  clearInterval(intervalTimer);
  intervalTimer = setInterval(showNextImage, 3000);
}

prevBtn.addEventListener("click", showPrevImage);
nextBtn.addEventListener("click", showNextImage);

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => goToImage(index));
});

// Init the slider
updateSlider();
