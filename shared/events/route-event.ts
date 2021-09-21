import { BaseEvent } from './event';
import { Route } from 'src/app/route';

export class RouteEvent extends BaseEvent {
  route: Route;

  constructor(route: Route) {
    super();

    this.route = route;
  }
}
