import { TestBed } from '@angular/core/testing';

import { TankService } from './tank.service';

describe('TankService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TankService = TestBed.get(TankService);
    expect(service).toBeTruthy();
  });
});
