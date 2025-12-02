import { Injectable } from '@angular/core';
import { DigitNormalizationService } from '../digitnormalization-service/digit-normalization-service';

export interface Iphonenumbervalidation {
  isValid: boolean;
  unmet: string[];
}

@Injectable({
  providedIn: 'root',
})
export class PhoneNumberValidation {
  validatePhoneNumber(phonenumber: string): Iphonenumbervalidation {
    const unmet: string[] = [];

    if (!phonenumber || phonenumber.trim().length === 0) {
      unmet.push('شماره تلفن الزامی است');
      return { isValid: false, unmet };
    }

    const cleaned = phonenumber.trim().replace(/[\s\-()]/g, ''); // remove spaces, dashes, parens

    if (cleaned.length !== 11) {
      unmet.push('شماره تلفن باید 11 رقم باشد');
    }

    // Validate Iranian mobile number format
    if (!/^09\d{9}$/.test(cleaned)) {
      unmet.push('فرمت شماره موبایل معتبر نمی باشد (باید با 09 شروع شده و 11 رقمی باشد)');
    }

    return { isValid: unmet.length === 0, unmet };
  }
}
