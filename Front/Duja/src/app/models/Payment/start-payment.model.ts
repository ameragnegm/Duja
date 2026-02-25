import { Checkout } from './../../pages/checkout/checkout';
export interface StartPaymentRequest {
    merchantOrderId: string;
    amountCents: number;
    walletPhone: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    method: number;
}

export interface StartPaymentResponse {
    checkoutUrl: string;
    paymobOrderId: string;
    method: number;
}