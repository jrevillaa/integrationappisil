import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaEditarComponent } from './area-editar.component';

describe('AreaEditarComponent', () => {
  let component: AreaEditarComponent;
  let fixture: ComponentFixture<AreaEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
