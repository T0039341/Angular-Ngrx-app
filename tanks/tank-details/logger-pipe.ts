import { Pipe, PipeTransform } from '@angular/core';
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';
import { format } from 'url';

@Pipe({ name: 'loggerPipe' })
export class loggerPipe implements PipeTransform {
  transform(value: string): string {
    return `Every  ${parseInt(+value/4+'')} hours ${+value%4 * 15} minutes`;

  }
}
