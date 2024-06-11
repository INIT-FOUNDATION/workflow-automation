import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameInitials'
})
export class NameInitialsPipe implements PipeTransform {

  transform(initial_name: string): string {
    let initials = '';
    if (initial_name) {
      let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

      let initialsArray = [...initial_name.matchAll(rgx)] || [];

      initials = ((initialsArray.shift()?.[1] || '') + (initialsArray.pop()?.[1] || '')).toUpperCase();


      if (initials.length == 1) {
        initials = `${initial_name[0]}${initial_name[1]}`.toUpperCase();
      }
    }
    return initials;
  }

}
