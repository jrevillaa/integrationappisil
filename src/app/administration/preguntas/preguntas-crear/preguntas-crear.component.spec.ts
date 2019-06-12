import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntasCrearComponent } from './preguntas-crear.component';

describe('PreguntasCrearComponent', () => {
  let component: PreguntasCrearComponent;
  let fixture: ComponentFixture<PreguntasCrearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreguntasCrearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreguntasCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
