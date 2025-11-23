import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor() {}

  // ----------------------------------------------------
  // PASSWORD VALIDATION
  // ----------------------------------------------------

  // ----------------------------------------------------
  // NATIONAL CODE VALIDATION
  // ----------------------------------------------------
  validateNationalCode(code: string): boolean {
    // Must be exactly 10 digits, no letters
    return /^[0-9]{10}$/.test(code);
  }

  // ----------------------------------------------------
  // PHONE NUMBER VALIDATION
  // ----------------------------------------------------
  validatePhoneNumber(phone: string): boolean {
    // Remove all non-digits
    const digitsOnly = phone.replace(/\D/g, '');

    // Must be 10 digits, cannot start with 0
    return /^[1-9][0-9]{9}$/.test(digitsOnly);
  }

  formatPhoneNumber(phone: string, prefix: string = '+98'): string {
    const digitsOnly = phone.replace(/\D/g, '');
    return `${prefix}${digitsOnly}`;
  }

  // ----------------------------------------------------
  // EMAIL VALIDATION
  // ----------------------------------------------------
  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Needs backend — kept as a placeholder
  async checkEmailExists(email: string): Promise<boolean> {
    return false;
  }

  // ----------------------------------------------------
  // MAIN VALIDATION ROUTER
  // ----------------------------------------------------
  validateField(type: string, value: string) {
    switch (type) {
      case 'nationalcode':
        return {
          valid: this.validateNationalCode(value),
          error: value.length ? 'کد ملی باید دقیقا ۱۰ رقم باشد.' : '',
          helper: [],
        };

      case 'phone':
        return {
          valid: this.validatePhoneNumber(value),
          error: value.length ? 'شماره موبایل معتبر نیست.' : '',
          helper: ['مثال صحیح: 9123456789', 'نباید با 0 شروع شود'],
        };

      case 'email':
        return {
          valid: this.validateEmail(value),
          error: value.length ? 'ایمیل معتبر نیست.' : '',
          helper: ['مثال: example@gmail.com'],
        };

      default:
        return { valid: true, error: '', helper: [] };
    }
  }
}
