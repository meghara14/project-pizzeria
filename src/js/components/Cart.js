import {select, classNames, templates, settings} from '../settings.js'
import utils from '../utils.js'
import CartProduct from './CartProduct.js';

class Cart {
    constructor(element) {
      const thisCart = this;

      thisCart.products = [];
      thisCart.dom = {};
      this.totalNumber = 0;
      this.subtotalPrice = 0;

      thisCart.getElements(element);
      thisCart.initActions();
    }
    getElements(element) {
      const thisCart = this;

      thisCart.dom = {

        wrapper: element,
        toggleTrigger: element.querySelector(select.cart.toggleTrigger),
        productList: element.querySelector(select.cart.productList),
        deliveryFee: element.querySelector(select.cart.deliveryFee),
        subtotalPrice: element.querySelector(select.cart.subtotalPrice),
        totalPrice: element.querySelectorAll(select.cart.totalPrice),
        totalNumber: element.querySelector(select.cart.totalNumber),
        form: element.querySelector(select.cart.form),
        address: element.querySelector(select.cart.address),
        phone: element.querySelector(select.cart.phone),
      };
    }
    initActions() {
      const thisCart = this;

      thisCart.dom.toggleTrigger.addEventListener('click', function (event) {
        event.preventDefault();
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });

      thisCart.dom.productList.addEventListener('updated', function () {
        thisCart.update();
      });

      thisCart.dom.productList.addEventListener('remove', function (event) {
        event.preventDefault();
        const cartProduct = event.detail.cartProduct;
        thisCart.remove(cartProduct);
      });

      thisCart.dom.form.addEventListener('submit', function (event) {
        event.preventDefault();
        thisCart.sentOrder();
      });

    }
    add(menuProduct) {
      const thisCart = this;

      const generatedHTML = templates.cartProduct(menuProduct);
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      thisCart.dom.productList.appendChild(generatedDOM);
      thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
      thisCart.products.push(menuProduct);
      thisCart.update();
    }
    update() {
      const thisCart = this;

      thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
      thisCart.totalNumber = 0;
      thisCart.subtotalPrice = 0;

      for (let singleProduct of thisCart.products) {
        thisCart.totalNumber += singleProduct.amount;
        thisCart.subtotalPrice += singleProduct.price;
      }

      thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;

      // Jeśli w koszyku nie ma produktów, koszt dostawy wynosi zero
      if (thisCart.totalNumber === 0) {
        thisCart.deliveryFee = 0;
      }

      // Aktualizacja HTML koszyka
      thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
      thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
      thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;

      for (let totalPriceElem of thisCart.dom.totalPrice) {
        totalPriceElem.innerHTML = thisCart.totalPrice;
      }
    }
    remove(cartProduct) {
      const thisCart = this;

      // Remove the product representation from HTML
      cartProduct.dom.wrapper.remove();

      // Find and remove the product from the products array
      const productIndex = thisCart.products.indexOf(cartProduct);
      if (productIndex !== -1) {
        thisCart.products.splice(productIndex, 1);
      }

      // Recalculate totals
      thisCart.update();
    }

    sentOrder() {
      const thisCart = this;
      const url = settings.db.url + '/' + settings.db.orders;
    
      const payload = {
        address: thisCart.dom.address.value,
        phone: thisCart.dom.phone.value,
        totalPrice: thisCart.totalPrice,
        subtotalPrice: thisCart.subtotalPrice,
        totalNumber: thisCart.totalNumber,
        deliveryFee: thisCart.deliveryFee,
        products: [],
      };
    
      for (let prod of thisCart.products) {
        console.log('Product:', prod);
        console.log('Has getData method:', 'getData' in prod);
        payload.products.push(prod.getData());
      }
    
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      };
    
      fetch(url, options)
        .then(function (response) {
          return response.json();
        })
        .then(function (parsedResponse) {
          console.log('parsedResponse', parsedResponse);
        });
    }
  }
  export default Cart;