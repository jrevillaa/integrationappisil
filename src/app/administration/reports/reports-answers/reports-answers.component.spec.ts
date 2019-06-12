import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsAnswersComponent } from './reports-answers.component';

describe('ReportsAnswersComponent', () => {
  let component: ReportsAnswersComponent;
  let fixture: ComponentFixture<ReportsAnswersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsAnswersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
