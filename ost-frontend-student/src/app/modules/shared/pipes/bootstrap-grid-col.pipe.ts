import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'bootstrapGridCol',
  pure: false
})
export class BootstrapGridColPipe implements PipeTransform {

  // transform(participants_list_length: number, is_recording_bot_present: boolean): string {
  //   let className = 'col-12';
  //   if (is_recording_bot_present) {
  //     participants_list_length -= 1;
  //   }
  //   if (participants_list_length && participants_list_length > 0) {
  //     if (participants_list_length == 1) {
  //       className = 'col-md-12';
  //     } else if ((participants_list_length == 2)) {
  //       className = 'col-md-6';
  //     } else if (participants_list_length > 2) {
  //       className = 'col-md-3';
  //     }
  //   }
  //   return className;
  // }

  transform(participants_list: any[], is_recording_bot_present: boolean): any[] {
    let anyPinnedVideo = participants_list.find(item => item.pinned);
    let temp_list = [...participants_list];
    temp_list = temp_list.filter(part => part.id.indexOf('_webinar') != -1);

    participants_list.forEach(item => {
      if (anyPinnedVideo) {
        if(item.pinned) {
          item.colClass = 'col-md-8';
        } else {
          item.colClass = 'col-md-4';
        }
      } else {
        let length = is_recording_bot_present ? (participants_list.length - 1) : participants_list.length;
        if (temp_list.length > 0) {
          length = length - temp_list.length;
        }
        if (length == 1) {
          item.colClass = 'col-md-12';
        } else if ((length == 2)) {
          item.colClass = 'col-md-6';
        } else if (length > 2) {
          item.colClass = 'col-md-3';
        }
      }
    });
    return participants_list;
  }

}
