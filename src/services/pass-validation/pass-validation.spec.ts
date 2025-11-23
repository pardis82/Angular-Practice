import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassValidation } from './pass-validation';

describe('PassValidation', () => {
  let component: PassValidation;
  let fixture: ComponentFixture<PassValidation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassValidation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassValidation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
