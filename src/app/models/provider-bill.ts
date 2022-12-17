export class ProviderBill {
    id?: number;
    providerName: string;
    nit: number;
    authorizationNumber: number;
    billNumber: number;
    totalAmount: number;
    controlCode: string;
    billDate: Date;
    purchaseType: number;
    duiNumber: string;
}