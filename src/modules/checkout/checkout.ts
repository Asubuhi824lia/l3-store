import { Component } from '../component';
import { Product } from '../product/product';
import html from './checkout.tpl.html';
import { formatPrice } from '../../utils/helpers';
import { cartService } from '../../services/cart.service';
import { ProductData } from 'types';
import localforage from 'localforage';

const DB = '__wb-orderId';

class Checkout extends Component {
  products!: ProductData[];

  async render() {
    this.products = await cartService.get();

    if (this.products.length < 1) {
      this.view.root.classList.add('is__empty');
      return;
    }

    this.products.forEach((product) => {
      const productComp = new Product(product, { isHorizontal: true });
      productComp.render();
      productComp.attach(this.view.cart);
    });

    const totalPrice = this.products.reduce((acc, product) => (acc += product.salePriceU), 0);
    this.view.price.innerText = formatPrice(totalPrice);

    this.view.btnOrder.onclick = () => {
      this._makeOrder.call(this);
      this._notifyOrder.call(this, totalPrice)
    }
  }

  async clear() {
    await localforage.removeItem(DB);
  }

  async get(): Promise<number> {
    return (await localforage.getItem(DB)) || 0;
  }

  async set(data: number) {
    await localforage.setItem(DB, data);
  }

  private async _makeOrder() {
    await cartService.clear();
    fetch('/api/makeOrder', {
      method: 'POST',
      body: JSON.stringify(this.products)
    });
    window.location.href = '/?isSuccessOrder';
  }

  private async _notifyOrder(totalPrice: number) {
    const orderId = await this.get()
    await fetch(' /api/sendEvent', {
      method: 'POST',
      body: JSON.stringify({
        type: 'purchase', 
        payload: { 
          orderId: orderId, 
          totalPrice: totalPrice, 
          productIds: this.products.map(product => product.id) 
        }
      })
    })
    await this.set(orderId+1)
  }
}

export const checkoutComp = new Checkout(html);
