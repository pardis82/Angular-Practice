import { TestBed } from '@angular/core/testing';

import { DigitNormalizationService } from './digit-normalization-service';

describe('DigitNormalizationService', () => {
  let service: DigitNormalizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DigitNormalizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
