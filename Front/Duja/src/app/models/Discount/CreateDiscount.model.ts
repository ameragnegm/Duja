export interface ICreateDiscount {
  name: string;
  description?: string | null;
  percentage: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  productIds: number[];
}