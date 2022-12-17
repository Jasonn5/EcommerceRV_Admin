import { Pipe, PipeTransform } from '@angular/core';
import { OrderStatusEnum } from 'src/app/models/enums/order-status-enum';

@Pipe({
  name: 'orderStatus'
})
export class OrderStatusPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (value == OrderStatusEnum.PENDING) {
      return "Pendiente";
    }
    if (value == OrderStatusEnum.COMPLETED) {
      return "Completado";
    }
    if (value == OrderStatusEnum.CANCELED) {
      return "Cancelado";
    }
  }

}
