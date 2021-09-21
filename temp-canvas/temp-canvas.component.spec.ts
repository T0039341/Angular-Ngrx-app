import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempCanvasComponent } from './temp-canvas.component';

describe('TempCanvasComponent', () => {
  let component: TempCanvasComponent;
  let fixture: ComponentFixture<TempCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
