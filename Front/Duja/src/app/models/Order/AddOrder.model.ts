import { IAddOrderItem } from "./AddOrderItem.model";

export interface IAddOrder {
  userId: string;
  ownerName: string;
  ownerPhone: string;
  deliveryPrice : number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  address: string;
  paymentMethod: string;
  orderItems: IAddOrderItem[];
}
