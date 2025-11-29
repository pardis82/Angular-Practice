import { Injectable } from '@angular/core';

export interface InationalCodeRequirements {
  isValid: boolean;
  unmet: string[];
}

@Injectable({
  providedIn: 'root',
})
export class NationalCodeValidation {
  validateNationalCode(code: string): InationalCodeRequirements {
    const unmet: string[] = [];

    // Convert Persian/Arabic digits to English
    const englishCode = this.convertToEnglishDigits(code);

    // Remove any non-digit characters
    const cleanCode = englishCode.replace(/\D/g, '');

    // Check if we have exactly 10 digits
    if (cleanCode.length !== 10) {
      unmet.push('کد ملی باید ۱۰ رقم باشد');
      return { isValid: false, unmet };
    }

    // Check if all digits are the same (like 0000000000, 1111111111, etc.)
    if (/^(\d)\1+$/.test(cleanCode)) {
      unmet.push('کد ملی نامعتبر است');
      return { isValid: false, unmet };
    }

    // Checksum validation
    const controlDigit = parseInt(cleanCode.charAt(9), 10);
    let sum = 0;

    for (let i = 0; i < 9; i++) {
      const digit = parseInt(cleanCode.charAt(i), 10);
      sum += digit * (10 - i);
    }

    const remainder = sum % 11;
    const isValidChecksum =
      (remainder < 2 && controlDigit === remainder) ||
      (remainder >= 2 && controlDigit === 11 - remainder);

    if (!isValidChecksum) {
      unmet.push('کد ملی معتبر نیست');
    }

    return {
      isValid: unmet.length === 0,
      unmet,
    };
  }

  private convertToEnglishDigits(text: string): string {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

    let result = text;

    // Convert Persian digits
    persianDigits.forEach((digit, index) => {
      result = result.replace(new RegExp(digit, 'g'), index.toString());
    });

    // Convert Arabic digits
    arabicDigits.forEach((digit, index) => {
      result = result.replace(new RegExp(digit, 'g'), index.toString());
    });

    return result;
  }
}
