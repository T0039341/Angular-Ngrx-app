import { CanDeactivate } from '@angular/router';
import { TankVerificationComponent } from './tank-verification.component';

export class TankVerificationDeactivateGuard implements CanDeactivate<TankVerificationComponent> {

  canDeactivate(component: TankVerificationComponent) {
    return component.canDeactivate();
  }
}
