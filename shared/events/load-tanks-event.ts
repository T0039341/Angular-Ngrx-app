import { BaseEvent } from './event';

export class LoadTankEvent extends BaseEvent {
  numberOfTanks: number;

  constructor(numberOfTanks: number) {
    super();

    this.numberOfTanks = numberOfTanks;
  }
}
