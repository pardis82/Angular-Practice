import { TestBed } from '@angular/core/testing';

import { AuthSignUp } from './auth-sign-up';

describe('AuthSignUp', () => {
  let service: AuthSignUp;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthSignUp);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
