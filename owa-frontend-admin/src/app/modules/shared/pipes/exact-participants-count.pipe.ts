import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'exactParticipantsCount',
  pure: false
})
export class ExactParticipantsCountPipe implements PipeTransform {

  transform(participants_list: any[], is_recording_bot_present: boolean, exclude_webinar: boolean): number {
    let participants_no = 0;
    if (participants_list && participants_list.length > 0) {
      let temp_list = participants_list.filter(part => part.id.indexOf('_webinar') != -1);
      let totalParticipants = participants_list.length;
      if (is_recording_bot_present) {
        totalParticipants -= 1;
      }


      if (exclude_webinar) {
        if (temp_list && temp_list.length > 0) {
          totalParticipants -= temp_list.length;
        }
      }


      participants_no = totalParticipants;
    }
    return participants_no;
  }

}
