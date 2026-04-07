import { IProductvarient } from "./productVarient.model";

export interface IUpdateProductModel {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  categoryId: number | null;

  variants: IProductvarient[];
  newImages: File[];
  imagesToDelete: number[];
}