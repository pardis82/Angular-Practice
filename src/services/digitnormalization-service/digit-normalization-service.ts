import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DigitNormalizationService {
  private readonly digitMap: Readonly<Record<string, string>> = {
    //Persian digits
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
    // Arabic digits
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

  convertToEnglishDigits(text: string): string {
    if (!text) return '';
    let result = '';
    for (const char of text) {
      result += this.digitMap[char] || char;
    }
    return result;
  }

  extractDigits(text: string): string {
    if (!text) return '';

    const normalized = this.convertToEnglishDigits(text);
    return normalized.replace(/\D/g, '');
  }

  normalizeArabicPersianNumbers(text: string): string {
    if (!text) return '';
    return text.replace(/[٠-٩۰-۹]/g, (char) => this.digitMap[char] || char);
  }
  isNumeric(text: string): boolean {
    if (!text) return false;

    const digits = this.extractDigits(text);
    return digits.length === text.length && /^\d+$/.test(digits);
  }
  isArabicOrPersianDigit(char: string): boolean {
    return char in this.digitMap;
  }
}
