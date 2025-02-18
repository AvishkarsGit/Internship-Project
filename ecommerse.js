const url = "https://fakestoreapi.com/products/";
// url = https://dummyjson.com/products
// https://fakestoreapi.com/products/

const itemsCount = document.querySelector("#items-count");

const products = async () => {
  try {
    const response = await axios.get(url);
    let items = response.data;
    for (let item of items) {
      addProducts(item);
    }
  } catch (error) {
    console.log(error);
  }
};

products();

const addProducts = (item) => {
  let title = truncateText(item.title, 50);
  const products = document.querySelector(".products");
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
  <img src='${item.image}' alt="" />
          <div class="title">
            <p>${title}</p>
          </div>
          <p><span>$ ${item.price}</span></p>
          <div>
            <button id='${item.id}' class="btnAdd">Add to cart</button>
          </div>
          <div class="starRating">
          </div>
  `;

  products.appendChild(card);
  displayStars(item.rating.rate, card.querySelector(".starRating"));

  card.querySelector(".btnAdd").addEventListener("click", async (e) => {
    let id = e.target.id;
    const response = await axios.get(`${url}${id}`);
    const item = {
      id: response.data.id,
      title: response.data.title,
      image: response.data.image,
      price: response.data.price,
      qty: 0,
    };
    addItemsToTheCart(item, id);
  });
};

function displayStars(rating, element) {
  let fullStars = Math.floor(rating);
  let halfStar = rating % 1 >= 0.5 ? 1 : 0;
  let emptyStars = 5 - fullStars - halfStar;

  element.innerHTML = ""; // Clear previous stars

  for (let i = 0; i < fullStars; i++) {
    let star = document.createElement("i");
    star.className = "bx bxs-star stars"; // Full star
    element.appendChild(star);
  }

  if (halfStar) {
    let star = document.createElement("i");
    star.className = "bx bxs-star-half stars"; // Half star
    element.appendChild(star);
  }

  for (let i = 0; i < emptyStars; i++) {
    let star = document.createElement("i");
    star.className = "bx bx-star stars"; // Empty star
    element.appendChild(star);
  }
}

const truncateText = (title, maxLength) => {
  return title.length > maxLength
    ? title.substring(0, maxLength) + "..."
    : title;
};

const addItemsToTheCart = async (item, id) => {
  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  for (let i = 0; i < cartItems.length; i++) {
    if (cartItems[i].id === id) {
      item.qty += 1;
    } else {
      item.qty = 1;
    }
  }
  cartItems.push(item);
  localStorage.setItem("cart", JSON.stringify(cartItems));
};
