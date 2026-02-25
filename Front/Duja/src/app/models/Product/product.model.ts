import { IproductImage } from './productimage.model';
import { IProductvarient } from "./productVarient.model";

export interface IProduct {
        id : number ;
        name : string;
        categoryId : number ;
        description : string ;
        images : IproductImage[] ;
        price : number;
        variants : IProductvarient[];
}
	