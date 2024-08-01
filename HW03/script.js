const imageContainerElem = document.querySelector(".image-container");
const loadMoreButton = document.getElementById("load-more");
let currentPage = 1;
let isFetching = false;

async function fetchImages(page) {
  try {
    isFetching = true;
    const response = await fetch(
      `https://api.unsplash.com/photos?page=${page}`,
      {
        headers: {
          Authorization:
            "Client-ID -y_cZ4CV8-Fa5s_OfBw8cNpltaeRYuDbsPG1zokTj_g",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Error, server status: ${response.status}`);
    }
    return await response.json();
  } finally {
    isFetching = false;
  }
}

function createImg(objInfo) {
  return `<div class="photo">
          <img src="${objInfo.urls.regular}" alt="${objInfo.user.name}" />
          <h2 class="author">${objInfo.user.name}</h2>
          <input class="like" type="checkbox" id="like-${objInfo.id}"/>
          <label for="like-${objInfo.id}" class="like-label">Like</label>
          <p class="counter">Likes: <span>${objInfo.likes}</span></p>
        </div>`;
}

function attachLikeListener() {
  const likeButtons = document.querySelectorAll(".like");
  likeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const counterElem =
        e.target.nextElementSibling.nextElementSibling.querySelector("span");
      let likeCount = parseInt(counterElem.textContent, 10);
      const imgSrc = e.target.closest(".photo").querySelector("img").src;

      if (e.target.checked) {
        counterElem.textContent = ++likeCount;
      } else {
        counterElem.textContent = --likeCount;
      }
      saveToLocalStorage(imgSrc, likeCount);
    });
  });
}

function saveToLocalStorage(imgSrc, likes) {
  localStorage.setItem(imgSrc, likes);
}

function getFromLocalStorage(imgSrc) {
  return localStorage.getItem(imgSrc);
}

function isExistInLocalStorage(imgSrc) {
  return localStorage.getItem(imgSrc) !== null;
}

function loadLikedImages() {
  const imgsHTML = "";
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    items[key] = localStorage.getItem(key);
  }
  imageContainerElem.innerHTML += imgsHTML;
}

async function main() {
  const data = await fetchImages(currentPage);
  console.log(data);
  let imgsHTML = "";
  data.forEach((element) => {
    if (isExistInLocalStorage(element.urls.regular)) {
      element.likes = getFromLocalStorage(element.urls.regular);
    }
    imgsHTML += createImg(element);
  });
  currentPage++;
  imageContainerElem.innerHTML += imgsHTML;
  attachLikeListener();
}

loadMoreButton.addEventListener("click", () => {
  if (!isFetching) {
    main();
  }
});

main();
