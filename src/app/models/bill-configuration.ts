export class BillConfiguration {
    id?: number;
    code: string;
    name: string;
    companyNit: number;
    authorizationNumber: number;
    emissionLimitDate: Date;
    billStartNumber: number;
    billActualNumber: number;
    dosageKey: string;
    economicActivity: string;
    legend: string;
    providerName: string;
    matrixHouse: string;
    location: string;
}