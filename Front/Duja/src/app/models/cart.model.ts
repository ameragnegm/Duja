import { IProductvarient } from './Product/productVarient.model';
import { IProduct } from "./Product/product.model";

export interface ICartItem {
  product: IProduct;
  variant: IProductvarient; 
  quantity: number;
}
