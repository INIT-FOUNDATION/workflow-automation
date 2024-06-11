import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'packagePrice',
})
export class PackagePricePipe implements PipeTransform {
  transform(
    plans: any[],
    monthly_yearly_flag: boolean,
    is_promotional_price = true
  ): string {
    let packageStartPrice = '';
    if (plans && plans.length > 0) {
      if (monthly_yearly_flag) {
        packageStartPrice = `${
          is_promotional_price
            ? plans[1].starting_from
            : plans[1].starting_from + 100
        }/Yrly`;
      } else {
        packageStartPrice = `${
          is_promotional_price
            ? plans[0].starting_from
            : plans[0].starting_from + 100
        }/Mo`;
      }
    }
    return packageStartPrice;
  }
}
