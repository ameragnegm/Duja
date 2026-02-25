import { IproductImage } from "./productimage.model";
import { IProductvarient } from "./productVarient.model";

export interface IUpdatedProduct {
        id : number ;
        name : string;
        categoryId : number ;
        description : string ;
        images : IproductImage[] ;
        newImages : File[];
        imagesToDelete  : number[]; 
        price : number;
        variants : IProductvarient[];
}
    