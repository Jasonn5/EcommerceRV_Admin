import { TransferStockDetail } from "./transfer-stock-detail";

export class TransferStock {
    id?: number;
    fromLocationId: number;
    toLocationId: number;
    transferStockDetails: TransferStockDetail[];
}