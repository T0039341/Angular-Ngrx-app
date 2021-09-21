import { Pipe, PipeTransform } from '@angular/core';
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';
import { format } from 'url';

@Pipe({ name: 'frequencyPipe' })
export class frequencyPipe implements PipeTransform {
  transform(value: string): string {
    console.log('pipe value', value);
    let val = +value;
    switch (val) {
      case 0:
        return 'Once per day';
      case 1:
        return 'Every 2 hours';
      case 2:
        return 'Every 4 hours';
      default:
        return value;
    }
  }
}
