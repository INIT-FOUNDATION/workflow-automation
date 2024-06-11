import { Pipe, PipeTransform } from '@angular/core';
import { ThemeService } from '../theme/theme.service';

@Pipe({
  name: 'assignRandomColor',
  pure: false
})
export class AssignRandomColorPipe implements PipeTransform {
  dynamicBgColors: any = [
    '#f4ecf9',
    '#eef3f7',
    '#faf8e9',
    '#eaf6e4',
    '#f1f9ef',
  ];

  transform(participantsList: any[]): any[] {
    let returnArray = []
    if (participantsList && participantsList.length > 0) {
      participantsList.forEach((item) => {
        if (!item.color) {
          item.color = this.dynamicBgColors[Math.floor(Math.random() * this.dynamicBgColors.length)];
          item.dark_mode_color = '#393939';
        }
      });
      returnArray = [...participantsList]
    }
    return returnArray;
  }
}
