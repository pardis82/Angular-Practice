import { Injectable } from '@angular/core';
import { DigitNormalizationService } from '../digitnormalization-service/digit-normalization-service';

export interface InationalCodeRequirements {
  isValid: boolean;
  unmet: string[];
}

@Injectable({
  providedIn: 'root',
})
export class NationalCodeValidation {
  constructor(private digitNormalizer: DigitNormalizationService) {}
  validateNationalCode(code: string | number): InationalCodeRequirements {
    const unmet: string[] = [];

    // Defensive: ensure we have a string
    if (code === null || code === undefined) {
      unmet.push('کد ملی الزامی است');
      return { isValid: false, unmet };
    }
    let input = String(code).trim();

    // Convert Persian/Arabic digits to English first
    input = this.digitNormalizer.extractDigits(input);

    // Remove non-ASCII digits (anything not 0-9)
    const cleanCode = input.replace(/[^0-9]/g, '');

    // length
    if (cleanCode.length !== 10) {
      unmet.push('کد ملی باید ۱۰ رقم باشد');
    }

    // equal digits (0000000000, 1111111111, ...)
    if (/^(\d)\1{9}$/.test(cleanCode)) {
      unmet.push('کد ملی نامعتبر است');
    }

    // checksum
    const controlDigit = Number(cleanCode.charAt(9));
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      const d = Number(cleanCode.charAt(i));
      sum += d * (10 - i);
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
}
