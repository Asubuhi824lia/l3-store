import { ViewTemplate } from '../../utils/viewTemplate';
import { View } from '../../utils/view';
import { formatPrice } from '../../utils/helpers'
import html from './product.tpl.html';
import { ProductData } from 'types';

type ProductComponentParams = { [key: string]: any };

export class Product {
  view: View;
  product: ProductData;
  params: ProductComponentParams;

  constructor(product: ProductData, params: ProductComponentParams = {}) {
    this.product = product;
    this.params = params;
    this.view = new ViewTemplate(html).cloneView();
  }

  attach($root: HTMLElement) {
    $root.appendChild(this.view.root);
  }

  render() {
    const { id, name, src, salePriceU } = this.product;

    this.view.root.setAttribute('href', `/product?id=${id}`);
    this.view.img.setAttribute('src', src);
    this.view.title.innerText = name;
    this.view.price.innerText = formatPrice(salePriceU);

    document.addEventListener('scroll', this._getNotifyFunc.call(this));

    if (this.params.isHorizontal) this.view.root.classList.add('is__horizontal')
  }

  private _getNotifyFunc() {
    let timeout: any;
  
    return () => {
        clearTimeout(timeout)
        timeout = setTimeout(this._notifViewCard.bind(this), 500)
    }
  }

  private async _notifViewCard() {
    if(this._isElemInViewPort(this.view.root)) {
      fetch(`/api/getProductSecretKey?id=${this.product.id}`)
      .then((res) => res.json())
      .then((secretKey) => 
      {
        fetch(' /api/sendEvent', {
          method: 'POST',
          body: JSON.stringify({
            type: this.product.log ? 'viewCardPromo' : 'viewCard', 
            payload: this.product + secretKey
          })
        })
        console.log('In viewport: ', this.product.id)
      })
    } else {
      console.log('Miss')
    }
  }

  private _isElemInViewPort(elem:HTMLElement, full=false) {
    var box = elem.getBoundingClientRect();
    var top = box.top;
    var left = box.left;
    var bottom = box.bottom;
    var right  = box.right;
    var width = document.documentElement.clientWidth;
    var height = document.documentElement.clientHeight;
    var maxWidth = 0;
    var maxHeight = 0;
    if(full) { maxWidth = right - left; maxHeight = bottom - top};
    return Math.min(height,bottom)- Math.max(0,top) >= maxHeight && Math.min(width,right)- Math.max(0,left)>= maxWidth
  }
}