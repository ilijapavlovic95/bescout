import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the DateFormatPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: Date, ...args) {
    if (!value)
      return ' ? ';
    return value.getDate()  + '.' + (value.getMonth()+1) + "." + value.getFullYear() + '.';
  }
}
