export interface IProductvarient {
    id: number;
    sizeID: number;
    colorID: number;
    stockQuantity: number;
    length: number | null;
    shoulder: number | null;
    bust: number | null;
    sleevelength: number | null;
    waist: number | null;
    hip: number | null;
    inseam: number | null;
    thigh: number | null;
    weight: number | null;

    note: string | null;
}