import { Component } from '../component';
import { Product } from '../product/product';
import html from './favorites.tpl.html';
import { favService } from '../../services/fav.service';
import { ProductData } from 'types';

class Favourites extends Component {
    products!: ProductData[];

    async render() {
        this.products = await favService.get();
        
        this.products.forEach((product) => {
          const productComp = new Product(product, { isHorizontal: true });
          productComp.render();
          productComp.attach(this.view.cart);
        });
    }
}

export const favoritesComp = new Favourites(html)