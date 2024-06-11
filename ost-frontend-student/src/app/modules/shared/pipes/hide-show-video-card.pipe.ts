import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hideShowVideoCard',
  pure: false
})
export class HideShowVideoCardPipe implements PipeTransform {

  transform(participant: any, card_type: string): string {
    let className = '';
    if(participant) {
      if (card_type == 'not-video') {
        if (participant.camera_off && participant.screen_share) {
          className = 'displayNone';
        } else if (!participant.camera_off && participant.screen_share) {
          className = 'displayNone';
        } else if (!participant.camera_off && !participant.screen_share) {
          className = 'displayNone';
        } else if (participant.camera_off && !participant.screen_share) {
          className = '';
        }
      } else if (card_type == 'video') {
        if (participant.camera_off && participant.screen_share) {
          className = '';
        } else if (!participant.camera_off && participant.screen_share) {
          className = '';
        } else if (!participant.camera_off && !participant.screen_share) {
          className = '';
        } else if (participant.camera_off && !participant.screen_share) {
          className = 'displayNone';
        }
      }
    }
    return className;
  }

}
