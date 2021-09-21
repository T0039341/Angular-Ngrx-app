export class BaseEvent {}

export class Event<T extends BaseEvent> {
  data: T;

  constructor(data: T) {
    this.data = data;
  }
}
