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

function addLikeToggle(likeButton) {
  likeButton.addEventListener("click", (e) => {
    const likeLabel = e.target.nextElementSibling;
    const countElem = e.target.closest(".photo").querySelector(".counter span");
    let post = JSON.parse(localStorage.getItem(e.target.id));

    if (e.target.checked) {
      countElem.innerHTML = parseInt(countElem.innerHTML, 10) + 1;
      likeLabel.innerHTML = "Unlike";
      post.likes++;
      post.liked_by_user = true;
    } else {
      countElem.innerHTML = parseInt(countElem.innerHTML, 10) - 1;
      likeLabel.innerHTML = "Like";
      post.likes--;
      post.liked_by_user = false;
    }

    localStorage.setItem(e.target.id, JSON.stringify(post));
  });
}

function loadImages(imageList) {
  imageContainerElem.innerHTML = "";
  imageList.forEach((img) => {
    const imgNode = document.createElement("div");
    imgNode.innerHTML = createImg(img);
    if (img.liked_by_user) {
      imgNode.querySelector(".like").checked = true;
      imgNode.querySelector(".like-label").innerHTML = "Unlike";
    }
    imageContainerElem.appendChild(imgNode);
  });

  const buttons = document.querySelectorAll(".photo .like");
  buttons.forEach((btn) => {
    addLikeToggle(btn);
  });
}

async function main() {
  try {
    const data = await fetchImages();
    const objects = await convertToObjects(data);
    objects.forEach((obj) => {
      localStorage.setItem(`like-${obj.id}`, JSON.stringify(obj));
    });
    loadImages(objects);
    console.log(objects);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();

loadHistoryButton.addEventListener("click", () => {
  if (!isFetching) {
    const storedImages = [];
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith("like-")) {
        storedImages.push(JSON.parse(localStorage.getItem(key)));
      }
    }
    loadImages(storedImages);
  }
});
