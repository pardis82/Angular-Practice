import { Injectable } from '@angular/core';

export interface InationalCodeRequirements {
  isValid: boolean;
  unmet: string[];
}

@Injectable({
  providedIn: 'root',
})
export class NationalCodeValidation {
  validateNationalCode(code: string | number | null | undefined): InationalCodeRequirements {
    const unmet: string[] = [];

    // Defensive: ensure we have a string
    if (code === null || code === undefined) {
      unmet.push('کد ملی الزامی است');
      return { isValid: false, unmet };
    }
    let input = String(code).trim();

    // Convert Persian/Arabic digits to English first
    input = this.convertToEnglishDigits(input);

    // Remove non-ASCII digits (anything not 0-9)
    const cleanCode = input.replace(/[^0-9]/g, '');

    // DEBUG: helpful log to see what's being validated (remove in production)
    // console.log('validateNationalCode input:', code, '->', input, 'clean:', cleanCode);

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

  private convertToEnglishDigits(text: string): string {
    if (!text) return '';

    // mapping for Persian and Arabic-Indic digits
    const map: Record<string, string> = {
      '۰': '0',
      '۱': '1',
      '۲': '2',
      '۳': '3',
      '۴': '4',
      '۵': '5',
      '۶': '6',
      '۷': '7',
      '۸': '8',
      '۹': '9',
      '٠': '0',
      '١': '1',
      '٢': '2',
      '٣': '3',
      '٤': '4',
      '٥': '5',
      '٦': '6',
      '٧': '7',
      '٨': '8',
      '٩': '9',
    };

    // Replace by iterating characters (safe and fast)
    let out = '';
    for (const ch of text) {
      out += map[ch] ?? ch;
    }
    return out;
  }
}
