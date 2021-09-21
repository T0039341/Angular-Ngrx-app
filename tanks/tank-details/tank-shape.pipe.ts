import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'tankShapePipe' })
export class TankShapePipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'h_cyl':
        return 'Cylinder (horizontal)';
      case 'v_cyl':
        return 'Cylinder (vertical)';
      case 'rect':
        return 'Rectangular';
      default:
        return 'Uknown shape';
    }
  }
}
