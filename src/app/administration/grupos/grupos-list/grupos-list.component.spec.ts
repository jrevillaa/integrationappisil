import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GruposListComponent } from './grupos-list.component';

describe('GruposListComponent', () => {
  let component: GruposListComponent;
  let fixture: ComponentFixture<GruposListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GruposListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GruposListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
