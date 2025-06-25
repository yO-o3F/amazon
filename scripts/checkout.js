import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  updateQuantity
} from '../data/cart.js';
import {products} from '../data/products.js';
import {calculatePrice} from './utils/money.js';

// 14b
updateCartQuantity();

let orderSummaryHTML = '';

cart.forEach((cartItem) => {
  const { productId } = cartItem;

  let matchingItem;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingItem = product;
    }
  });

  orderSummaryHTML += `
    <div class="cart-item-container 
      js-cart-item-${matchingItem.id}">
      <div class="delivery-date">
        Delivery date: Tuesday, June 21
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingItem.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingItem.name}
          </div>
          <div class="product-price">
            $${calculatePrice(matchingItem.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label js-quantity-label-${matchingItem.id}">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingItem.id}">
              Update
            </span>
            <!-- 14g -->
            <input class="quantity-input js-quantity-input-${matchingItem.id}">
            <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingItem.id}">
              Save
            </span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingItem.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          <div class="delivery-option">
            <input type="radio" checked
              class="delivery-option-input"
              name="delivery-option-${matchingItem.id}">
            <div>
              <div class="delivery-option-date">
                Tuesday, June 21
              </div>
              <div class="delivery-option-price">
                FREE Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="delivery-option-${matchingItem.id}">
            <div>
              <div class="delivery-option-date">
                Wednesday, June 15
              </div>
              <div class="delivery-option-price">
                $4.99 - Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="delivery-option-${matchingItem.id}">
            <div>
              <div class="delivery-option-date">
                Monday, June 13
              </div>
              <div class="delivery-option-price">
                $9.99 - Shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
});

document.querySelector('.js-order-summary')
  .innerHTML = orderSummaryHTML;

document.querySelectorAll('.js-delete-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const { productId } = link.dataset;
      // me
      deleteQuantityInput(productId);
      
      // 14c
      /* document.querySelector('.js-return-to-home-link')
        .innerHTML = calculateCartQuantity(); */
    });
});

// 14f
document.querySelectorAll('.js-update-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const { productId } = link.dataset;

      // 14h
      document.querySelector(`.js-cart-item-${productId}`)
        .classList.add('is-editing-quantity');

      // 14n
      document.addEventListener('keydown', 
        function clickedKey(event) {
          if (event.key === 'Enter') {
            saveQuantityInput(productId);
            document.removeEventListener('keydown', clickedKey);
          }
        });
    });
});

// 14j
document.querySelectorAll('.js-save-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const { productId } = link.dataset;

      /* document.querySelector(`.js-cart-item-${productId}`)
        .classList.remove('is-editing-quantity');

      // 14k
      /* const inputNumber = Number(document.querySelector(`.js-quantity-input-${matchingItem.id}`).value);

      console.log(inputNumber);  

      // 14l
      updateQuantity(productId, inputNumber);

      // 14m
      document.querySelector(`.js-quantity-label-${productId}`)
        .innerHTML = inputNumber;

      document.querySelector('.js-return-to-home-link')
        .innerHTML = calculateCartQuantity(); 

      // 14n
      const inputNumber = Number(document.querySelector(`.js-quantity-input-${productId}`).value);

      if (inputNumber >= 0 && inputNumber < 1000) {
        updateQuantity(productId, inputNumber);

        document.querySelector(`.js-quantity-label-${productId}`)
        .innerHTML = inputNumber;

        document.querySelector('.js-return-to-home-link')
        .innerHTML = calculateCartQuantity();
      } */

        // 14n
        saveQuantityInput(productId);
    });
});

// 14n
function saveQuantityInput(productId) {
  document.querySelector(`.js-cart-item-${productId}`)
    .classList.remove('is-editing-quantity');

  const inputNumber = Number(document.querySelector(`.js-quantity-input-${productId}`).value);

  if (inputNumber === 0) {
    deleteQuantityInput(productId);
  
  } else if (inputNumber > 0 && inputNumber < 1000) {
    updateQuantity(productId, inputNumber);

    document.querySelector(`.js-quantity-label-${productId}`)
      .innerHTML = inputNumber;

    updateCartQuantity();
  
  } else {
    alert('Quantity must be at least 0 and less than 1000');
  }
}

// I liked using a function for save quantity input so I created
// another function for delete button too. this way I can add 
// another feature which is delete item if the quantity user enters
// is 0. but there is a problem I need to solve: when user doesn't 
// enter a number inside input, it will remove the quantity and
// sets it to 0. which might remove the item unintentionaly.
function deleteQuantityInput(productId) {
  removeFromCart(productId);

  const container = document.querySelector(`.js-cart-item-${productId}`);
  container.remove();

  updateCartQuantity();
}

function updateCartQuantity() {
  document.querySelector('.js-return-to-home-link')
    .innerHTML = `${calculateCartQuantity()} items`;
}