import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socketLiveWebinarCounter: any;
  constructor() {
    this.liveCounterSocketConnect();
  }

  liveCounterSocketConnect() {
    try {
      this.socketLiveWebinarCounter = io(
        `${environment.socket_webinar_live_counter}`,
        { transports: ['websocket'], forceNew: true }
      ).connect();
    } catch (err) {
      console.log(err);
    }
  }

  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socketLiveWebinarCounter.on(eventName, (data: any) => {
        subscriber.next(data);
      });
    });
  }

  emit(eventName: string, data: any) {
    this.socketLiveWebinarCounter.emit(eventName, data);
  }

  disconnect() {
    if (this.socketLiveWebinarCounter) {
      try {
        this.socketLiveWebinarCounter.disconnect();
      } catch (error) {
        console.log(error);
      }
    }
  }
}
