const accessKey = "-y_cZ4CV8-Fa5s_OfBw8cNpltaeRYuDbsPG1zokTj_g";
const currentPage = Math.floor(Math.random() * 10);
console.log(`Current loaded page: ${currentPage}`);

const imageContainerElem = document.querySelector(".image-container");
const loadHistoryButton = document.getElementById("load-history");

let isFetching = false;

async function fetchImages() {
  try {
    isFetching = true;
    const response = await fetch(
      `https://api.unsplash.com/photos?page=${currentPage}&client_id=${accessKey}`
    );
    if (!response.ok) {
      throw new Error(`Error, server status: ${response.status}`);
    }
    return await response.json();
  } finally {
    isFetching = false;
  }
}

function createImg(post) {
  return `<div class="photo">
          <img src="${post.src}" alt="${post.author}" />
          <h2 class="author">${post.author}</h2>
          <input class="like" type="checkbox" id="like-${post.id}"/>
          <label for="like-${post.id}" class="like-label">Like</label>
          <p class="counter">Likes: <span>${post.likes}</span></p>
        </div>`;
}

async function convertToObjects(data) {
  const simpleObjectArray = [];
  data.forEach((element) => {
    simpleObjectArray.push({
      id: element.id,
      src: element.urls.regular,
      author: element.user.name,
      likes: element.likes,
      liked_by_user: false,
    });
  });
  return simpleObjectArray;
}

function loadImages(imageList) {
  imageContainerElem.innerHTML = "";
  imageList.forEach((img) => {
    imageContainerElem.innerHTML += createImg(img);
  });
}

async function main() {
  try {
    const data = await fetchImages();
    const objects = await convertToObjects(data);
    loadImages(objects);
    console.log(objects);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();

// function attachLikeListener() {
//   const likeButtons = document.querySelectorAll(".like");
//   likeButtons.forEach((button) => {
//     button.addEventListener("click", (e) => {
//       const counterElem =
//         e.target.nextElementSibling.nextElementSibling.querySelector("span");

//       let likeCount = parseInt(counterElem.textContent, 10);
//       const imgSrc = e.target.closest(".photo").querySelector("img").src;
//       const authorName = e.target.closest(".author").textContent;

//       if (e.target.checked) {
//         counterElem.textContent = ++likeCount;
//       } else {
//         counterElem.textContent = --likeCount;
//       }
//       saveToLocalStorage(imgSrc, { likes: likeCount, author: authorName });
//     });
//   });
// }

// async function main() {
//   const data = await fetchImages(currentPage);
//   console.log(data);
//   let imgsHTML = "";
//   data.forEach((element) => {
//     if (isExistInLocalStorage(element.urls.regular)) {
//       element.likes = getFromLocalStorage(element.urls.regular);
//     }
//     imgsHTML += createImg(element);
//   });
//   currentPage++;
//   imageContainerElem.innerHTML += imgsHTML;
//   attachLikeListener();
// }

// loadHistoryButton.addEventListener("click", () => {
//   if (!isFetching) {
//     main();
//   }
// });

// main();
