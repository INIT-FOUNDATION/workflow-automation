import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countryCode'
})
export class CountryCodePipe implements PipeTransform {

  transform(dial_code: string, country_codes_list: any[]): string {
    let country_code = 'xx';
    if (dial_code && country_codes_list && country_codes_list.length > 0) {
      let country = country_codes_list.find(country_code => country_code.dial_code === dial_code);
      country_code = country ? country.country_code : 'xx';
      country_code = country_code.toLowerCase();
    }
    return country_code;
  }

}
