import { IOrderItem } from "./orderitem.model";

export interface IOrder {
    id: number;
    orderDate: string;
    status: string;
    ownerName: string;
    delivery :number ;
    ownerPhone: string;
    totalAmount: number;
    paidAmount : number; 
    remainingAmount : number;
    userName: string;
    address: string;
    orderItems: IOrderItem[];
}