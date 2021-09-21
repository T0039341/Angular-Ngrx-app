import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TankVerificationComponent } from './tank-verification.component';

describe('TankVerificationComponent', () => {
  let component: TankVerificationComponent;
  let fixture: ComponentFixture<TankVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TankVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TankVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
