import { NavigationEnd } from '@angular/router';
import { startWith, filter, pairwise, map } from 'rxjs/operators';

export class Route {
  url: string;
  queryParams: string;
  path: string;
  segments: string[];
  currentTankId: string;
  router: any;
  currentUrl: any;
  isAddingTank: boolean;
  currentPath: any;
  currentQueryParams: string;

  constructor(url: string) {
    this.url = url;

    const components = this.router.url.split('?');

    console.log('the components', components);

    const segments = components[0].split('/').filter(val => val !== '');

    console.log('segments', segments);

    const lastSegment = segments[segments.length - 1];

    if (
      segments.length > 2 &&
      segments[1] === 'tanks' &&
      segments[2] !== 'add'
    ) {
      this.currentTankId = segments[2];
    } else {
      this.currentTankId = '';
    }

    if (segments.length > 2 && segments[2] === 'add') {
      this.isAddingTank = true;
    } else {
      this.isAddingTank = false;
    }

    this.currentPath = components[0];

    if (components.length >= 2) {
      this.currentQueryParams = `?${components[1]}`;
    }
  }
}
