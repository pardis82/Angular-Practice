import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneNumberEntry } from './phone-number-entry';

describe('PhoneNumberEntry', () => {
  let component: PhoneNumberEntry;
  let fixture: ComponentFixture<PhoneNumberEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhoneNumberEntry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhoneNumberEntry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
