import { Component } from '../component';
import html from './catalog.tpl.html';
import { ProductList } from '../productList/productList';
import { Searchtips } from '../searchtips/searchtips';

class Catalog extends Component {
  productList: ProductList;

  constructor(props: any) {
    super(props);

    const search = new Searchtips(this.view.products)
    search.attach(this.view.search)

    this.productList = new ProductList();
    this.productList.attach(this.view.products);
  }

  attach($root: HTMLElement) {
    $root.innerHTML = '';
    $root.appendChild(this.view.root);
  }

  async render() {
    const productsResp = await fetch('/api/getProducts');
    const products = await productsResp.json();
    this.productList.update(products);
  }
}

export const catalogComp = new Catalog(html);
