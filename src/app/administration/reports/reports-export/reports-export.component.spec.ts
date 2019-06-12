import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsExportComponent } from './reports-export.component';

describe('ReportsExportComponent', () => {
  let component: ReportsExportComponent;
  let fixture: ComponentFixture<ReportsExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
