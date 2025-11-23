import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor() {}

  // ----------------------------------------------------
  // PASSWORD VALIDATION
  // ----------------------------------------------------
  getPasswordRequirements(password: string) {
    const requirements = {
      lowerCase: /[a-z]/.test(password),
      upperCase: /[A-Z]/.test(password),
      hasNumbers: /[0-9]/.test(password),
      hasSpecialCharacters: /[@#$%^&*!?]/.test(password),
      isLengthy: password.length >= 8,
    };

    const score = Object.values(requirements).filter(Boolean).length;

    const unmet: string[] = [];

    if (!requirements.lowerCase) unmet.push('•  یک حرف کوچک');
    if (!requirements.upperCase) unmet.push('•  یک حرف بزرگ');
    if (!requirements.hasNumbers) unmet.push('•  یک عدد');
    if (!requirements.hasSpecialCharacters) unmet.push('•  یکی از این کاراکترها (@ # $ % ! ?)');
    if (!requirements.isLengthy) unmet.push('•  حداقل 8 کاراکتر');

    return { requirements, score, unmet };
  }

  getPasswordStrengthColor(score: number): string {
    if (score <= 1) return 'bg-red-600';
    if (score === 2) return 'bg-yellow-500';
    if (score === 3) return 'bg-yellow-400';
    if (score === 4) return 'bg-yellow-300';
    return 'bg-green-400';
  }

  getPasswordStrengthPercentage(score: number): number {
    return (score / 5) * 100;
  }

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
    if (!value || value.trim().length === 0) {
      return { error: '', helper: [], extra: {} };
    }

    switch (type) {
      case 'password': {
        const pw = this.getPasswordRequirements(value);
        return {
          valid: pw.unmet.length === 0,
          error: pw.unmet.length ? 'رمز عبور ضعیف است.' : '',
          helper: pw.unmet, // unmet rules disappear as they are satisfied
          extra: {
            score: pw.score,
            color: this.getPasswordStrengthColor(pw.score),
            percentage: this.getPasswordStrengthPercentage(pw.score),
          },
        };
      }

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
