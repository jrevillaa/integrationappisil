import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreQuizComponent } from './pre-quiz.component';

describe('PreQuizComponent', () => {
  let component: PreQuizComponent;
  let fixture: ComponentFixture<PreQuizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreQuizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
