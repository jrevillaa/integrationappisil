import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsExport2Component } from './reports-export2.component';

describe('ReportsExport2Component', () => {
  let component: ReportsExport2Component;
  let fixture: ComponentFixture<ReportsExport2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsExport2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsExport2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
