import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSistemListComponent } from './user-sistem-list.component';

describe('UserSistemListComponent', () => {
  let component: UserSistemListComponent;
  let fixture: ComponentFixture<UserSistemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSistemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSistemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
