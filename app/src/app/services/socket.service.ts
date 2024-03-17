import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { helpers, models } from '../../utils';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;

  constructor() {
    this.socket = io(helpers.apiBaseURL, {
      transports: ['polling'],
      reconnection: false,
      // rejectUnauthorized: false,
    });
  }

  emit(event: models.ioEvents, message: models.ioPayload) {
    this.socket.emit(event, message);
  }

  receive(event: models.ioEvents, callback: (message: models.ioPayload) => void) {
    this.socket.on(event, callback);
  }
}
