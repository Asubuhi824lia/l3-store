import localforage from 'localforage';
import { ProductData } from 'types';

const DB = '__wb-fav';

class FavService {
    init() {
        this._updLink()
    }

    async addProduct(product: ProductData) {
        const products = await this.get();
        await this.set([...products, product]);
        this._updLink()
    }
    
    async removeProduct(product: ProductData) {
        const products = await this.get();
        await this.set(products.filter(({ id }) => id !== product.id));
        this._updLink()
    }

    async clear() {
        await localforage.removeItem(DB);
    }

    async get(): Promise<ProductData[]> {
        return (await localforage.getItem(DB)) || [];
    }
    
    async set(data: ProductData[]) {
        await localforage.setItem(DB, data);
    }

    async isInFav(product: ProductData) {
        const products = await this.get();
        return products.some(({ id }) => id === product.id);
    }

    private async _updLink() {
        const products = await this.get();
        
        if(products.length > 0) {
            document.querySelector('.fav')?.classList.remove('hide');
        } else {
            document.querySelector('.fav')?.classList.add('hide');
        }
    }
}

export const favService = new FavService()