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
  constructor(private NormalizeDigits: DigitNormalizationService) {}
  validatePhoneNumber(phonenumber: string): Iphonenumbervalidation {
    const unmet: string[] = [];

    if (!phonenumber || phonenumber.trim().length === 0) {
      unmet.push('شماره تلفن الزامی است');
      return { isValid: false, unmet };
    }
    const normalizedNumber = this.NormalizeDigits.extractDigits(phonenumber);
    // حذف فاصله، خط تیره و کاراکترهای غیرعددی
    const cleaned = normalizedNumber.replace(/[\s\-()]/g, '');

    if (cleaned.length !== 11) {
      unmet.push('شماره تلفن باید 11 رقم باشد');
    }

    // اعتبارسنجی شماره موبایل ایران
    if (!/^09\d{9}$/.test(cleaned)) {
      unmet.push('فرمت شماره موبایل معتبر نمی باشد (باید با 09 شروع شده و 11 رقمی باشد)');
    }

    return { isValid: unmet.length === 0, unmet };
  }
}
