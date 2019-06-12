import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSistemEditComponent } from './user-sistem-edit.component';

describe('UserSistemEditComponent', () => {
  let component: UserSistemEditComponent;
  let fixture: ComponentFixture<UserSistemEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSistemEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSistemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
