import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntasEditarComponent } from './preguntas-editar.component';

describe('PreguntasEditarComponent', () => {
  let component: PreguntasEditarComponent;
  let fixture: ComponentFixture<PreguntasEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreguntasEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreguntasEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
