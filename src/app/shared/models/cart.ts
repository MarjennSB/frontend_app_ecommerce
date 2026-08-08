import { Product } from '../../core/models/product-model';

export interface CartProduct {
  product: Product;
  quantity: number;
}

export interface Cart extends Array<CartProduct> {}
