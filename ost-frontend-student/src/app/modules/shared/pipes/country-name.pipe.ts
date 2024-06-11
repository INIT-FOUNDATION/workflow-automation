import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countryName'
})
export class CountryNamePipe implements PipeTransform {

  transform(country_code: string): string {
    if (country_code) {
      let regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
      return regionNames.of(country_code);
    }
    return null;
  }

}
