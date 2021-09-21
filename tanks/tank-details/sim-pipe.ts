import { Pipe, PipeTransform } from '@angular/core';
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';
import { format } from 'url';

@Pipe({ name: 'tankSimPipe' })
export class tankSimPipe implements PipeTransform {
  transform(value: string): string {
    let phone = parsePhoneNumberFromString(value, 'LB');
    if (value = null) {
      return value;
    } else {
      return phone.formatInternational();
    }
  }
}
