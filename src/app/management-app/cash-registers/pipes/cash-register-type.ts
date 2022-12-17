import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'type'
})
export class TypePipe implements PipeTransform {

    transform(value: number): string {
        if (value == 1) {
            return 'Haber';
        }
        if (value == 2) {
            return 'Debe';
        }
    }
}