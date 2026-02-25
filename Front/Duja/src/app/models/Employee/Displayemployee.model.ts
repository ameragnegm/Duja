import { IRole } from "./employeetitle.model";

export interface IDisplayEmp {
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