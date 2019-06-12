import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSistemCreateComponent } from './user-sistem-create.component';

describe('UserSistemCreateComponent', () => {
  let component: UserSistemCreateComponent;
  let fixture: ComponentFixture<UserSistemCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSistemCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSistemCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
