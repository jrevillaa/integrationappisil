import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimensionesComponent } from './dimensiones.component';

describe('DimensionesComponent', () => {
  let component: DimensionesComponent;
  let fixture: ComponentFixture<DimensionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimensionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimensionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
