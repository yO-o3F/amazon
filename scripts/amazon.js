import {addToCart, calculateCartQuantity} from '../data/cart.js';
import {products} from '../data/products.js';
import {calculatePrice} from './utils/money.js';

let productsHTML = '';

products.forEach((product) => {
  productsHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        $${calculatePrice(product.priceCents)}
      </div>

      <div class="product-quantity-container">
        <select class="js-quantity-selector-${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart js-added-to-cart-${product.id}">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `;
});

document.querySelector('.js-products-grid')
  .innerHTML += productsHTML;

// 14d
// I'm not sure if this is the correct spot to load the quantity, we can calculate it as soon as page loads.
if (calculateCartQuantity() !== 0) {
  document.querySelector('.js-cart-quantity')
    .innerHTML = calculateCartQuantity();
}

const addedMessageTimeouts = {};
  
document.querySelectorAll('.js-add-to-cart')
  .forEach((button) => {
    button.addEventListener('click', () => {
      const { productId } = button.dataset;
      const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
      const quantity = Number(quantitySelector.value);
      const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`)
      
      /* I solved this exercise corrctly a day after I looked at its solution.
       It was so hard and I couldn't solve it on my own, in my own code I 
       wrote a solution which 'added-to-cart-visible' class of one or more
       buttons would get deleted at the same time after 2 seconds of clicking the last button.
       I rewrite it and reached a point where everything was working except if I clicked second
       button for few times (after clicking the first one few times and 2 seconds hasn't passed) 
       it would not clear its timeout and the class would disapper sooner, but after that everything
       would work normal again.
       my problem was that I didn't define add to cart buttons using their productId and I was just 
       storing their timeout ids which wasn't correct.*/

      addedMessage.classList.add('added-to-cart-visible');
      const previousTimeoutId = addedMessageTimeouts[productId];

      if (addedMessageTimeouts[productId]) {
        clearTimeout(previousTimeoutId);
      }

      const timeoutId = setTimeout(() => {
        addedMessage.classList.remove('added-to-cart-visible');
      }, 2000);

      addedMessageTimeouts[productId] = timeoutId;
      
      addToCart(productId, quantity);
      document.querySelector('.js-cart-quantity')
        .innerHTML = calculateCartQuantity();
  });
});