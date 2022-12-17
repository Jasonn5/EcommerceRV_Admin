import { Location } from './location';
import { MerchandiseDetail } from './merchandise-detail';
import { Provider } from './provider';

export class MerchandiseRegister {
    id?: number;
    billNumber: string;
    registerDate: Date;
    billUrl: string;
    location: Location;
    provider: Provider;
    generateExpense: boolean;
    merchandiseDetails: MerchandiseDetail[];
}