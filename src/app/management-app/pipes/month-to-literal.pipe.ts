import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthToLiteral'
})
export class MonthToLiteralPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (value == 1) {
      return 'Enero';
    }
    if (value == 2) {
      return 'Febrero';
    }
    if (value == 3) {
      return 'Marzo';
    }
    if (value == 4) {
      return 'Abril';
    }
    if (value == 5) {
      return 'Mayo';
    }
    if (value == 6) {
      return 'Junio';
    }
    if (value == 7) {
      return 'Julio';
    }
    if (value == 8) {
      return 'Agosto';
    }
    if (value == 9) {
      return 'Septiembre';
    }
    if (value == 10) {
      return 'Octubre';
    }
    if (value == 11) {
      return 'Noviembre';
    }
    if (value == 12) {
      return 'Diciembre';
    }
  }

}
