import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNameValidation } from './user-name-validation';

describe('UserNameValidation', () => {
  let component: UserNameValidation;
  let fixture: ComponentFixture<UserNameValidation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserNameValidation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserNameValidation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
