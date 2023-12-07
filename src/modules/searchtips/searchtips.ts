import { Component } from '../component';
import html from './searchtips.tpl.html';
import { ProductData } from 'types';

export class Searchtips extends Component {
    products: ProductData[];

    constructor(products: ProductData[]) {
        super(html)

        this.products = products;
    }

    attach($root: HTMLElement) {
        $root.appendChild(this.view.root);
    }
}