import { Pipe, PipeTransform } from '@angular/core';
import { DurationMeasureEnum } from 'src/app/models/enums/duration-measure-enum';

@Pipe({
  name: 'durationMeasureType'
})
export class DurationMeasureTypePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (value == DurationMeasureEnum.MINUTES) {
      return "Minutos";
    }
    if (value == DurationMeasureEnum.HOURS) {
      return "Horas";
    }
    if (value == DurationMeasureEnum.DAYS) {
      return "Días";
    }
    if (value == DurationMeasureEnum.WEEKS) {
      return "Semanas";
    }
    if (value == DurationMeasureEnum.MONTHS) {
      return "Meses";
    }
    if (value == 0) {
      return "Ninguna";
    }
  }

}
