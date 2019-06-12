import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GruposCrearComponent } from './grupos-crear.component';

describe('GruposCrearComponent', () => {
  let component: GruposCrearComponent;
  let fixture: ComponentFixture<GruposCrearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GruposCrearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GruposCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
