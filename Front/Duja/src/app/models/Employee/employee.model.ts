import { IRole } from "./employeetitle.model";

export interface Iemployee {
    id: number;
    userName : string ; 
    phoneNumber: string;
    fullName: string;
    email: string; 
    roles : IRole [];
    address: string;
    hireDate: Date;
    birthdate: Date;
    userId: number;
    salary: number;
} 