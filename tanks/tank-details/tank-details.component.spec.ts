import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TankDetailsComponent } from './tank-details.component';

describe('TankDetailsComponent', () => {
  let component: TankDetailsComponent;
  let fixture: ComponentFixture<TankDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TankDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
