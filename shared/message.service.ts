import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from './message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messageStream = new Subject<Message>();
  currentStream = this.messageStream.asObservable();

  constructor() {}

  push(message: Message) {
    this.messageStream.next(message);
  }
}
