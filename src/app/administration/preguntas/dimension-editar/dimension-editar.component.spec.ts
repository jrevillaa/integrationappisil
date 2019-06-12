import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimensionEditarComponent } from './dimension-editar.component';

describe('DimensionEditarComponent', () => {
  let component: DimensionEditarComponent;
  let fixture: ComponentFixture<DimensionEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimensionEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimensionEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
