import {select} from '../settings.js'
import AmountWidget from './AmountWidget.js';

class CartProduct {
    constructor(menuProduct, element) {
      const thisCartProduct = this;

      thisCartProduct.id = menuProduct.id;
      thisCartProduct.name = menuProduct.name;
      thisCartProduct.amount = menuProduct.amount;
      thisCartProduct.priceSingle = menuProduct.priceSingle;
      thisCartProduct.price = menuProduct.price;
      thisCartProduct.params = menuProduct.params;
  

      thisCartProduct.getElements(element);
      this.initAmountWidget(this.amount);
      this.initActions();
      
    }

    getElements(element) {
      const thisCartProduct = this;

      thisCartProduct.dom = {};

      thisCartProduct.dom.wrapper = element;
      thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
      thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
      thisCartProduct.dom.amount = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amount);
      thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
      thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);
    }
    initAmountWidget(amount) {
      this.amountWidget = new AmountWidget(this.dom.amountWidget);
      this.amountWidget.setValue(amount);

      this.dom.amountWidget.addEventListener('updated', event => {
        event.preventDefault();
        const amount = this.amountWidget.value;
        const price = this.priceSingle;
        this.amount = amount;
        this.price = amount * price;
        this.dom.price.innerHTML = price * amount;
      });

    }

    initActions() {
      const thisCartProduct = this;

      thisCartProduct.dom.edit.addEventListener('click', function (event) {
        event.preventDefault();
        // Add your edit logic here
      });

      thisCartProduct.dom.remove.addEventListener('click', function (event) {
        event.preventDefault();
        const removeEvent = new CustomEvent('remove', {
          bubbles: true,
          detail: {
            cartProduct: thisCartProduct,
          },
        });
        thisCartProduct.dom.wrapper.dispatchEvent(removeEvent);
      });
    }
    remove() {
      const thisCartProduct = this;

      const event = new CustomEvent('remove', {
        bubbles: true,
        detail: {
          cartProduct: thisCartProduct,
        },
      });
      thisCartProduct.dom.wrapper.dispatchEvent(event);
    }
    getData() {
      const thisCartProduct = this;

      const data = {
        id: thisCartProduct.id,
        amount: thisCartProduct.amount,
        price: thisCartProduct.price,
        priceSingle: thisCartProduct.priceSingle,
        name: thisCartProduct.name,
        params: thisCartProduct.params,
      };

      return data;
    }
  }
  export default CartProduct;  