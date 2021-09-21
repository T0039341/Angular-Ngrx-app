export class Message {
  static INFO: string = 'info';
  static ERROR: string = 'error';

  constructor(public data: string = "", public type: string = Message.ERROR) {
  }
}
