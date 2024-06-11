import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vcActionIcons',
  pure: false
})
export class VcActionIconsPipe implements PipeTransform {

  transform(participants: any[], icon_type: string): string {
    let icon = '';
    if (participants && participants.length > 0) {
      let participant = participants[0];
      switch (icon_type) {
        case 'mic':
          if(participant.mic_off) {
            icon = 'custom-vc-mic-audio';
          } else {
            icon = 'custom-vc-mic-on-icon';
          }
          break;
        case 'camera':
          if(participant.camera_off) {
            icon = 'custom-vc-video-call';
          } else {
            icon = 'custom-vc-video-on-icon';
          }
        break;
        case 'screen-share':
          if(participant.screen_share) {
            icon = 'custom-vc-screen-share';
          } else {
            icon = 'custom-vc-screen-share';
          }
        break;
        case 'projection':
          if(participant.projection) {
            icon = 'custom-vc-action-projection';
          } else {
            icon = 'custom-vc-action-projection';
          }
        break;
        default:
          break;
      }
    }
    return icon;
  }

}
