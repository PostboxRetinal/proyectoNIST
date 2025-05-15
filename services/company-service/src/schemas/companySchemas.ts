import { BusinessType, EmployeeRange } from "../constants/businessTypes";
// Interfaz para los datos de la empresa
export interface CompanyData {
    nit: string;
    companyName: string;
    email: string;
    phone: string;
    address: string;
    businessType: BusinessType;
    employeeRange: EmployeeRange;
    createdAt: Date;
    updatedAt: Date;
};