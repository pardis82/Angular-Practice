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
    const digitReplacer = code.replace(/\D/g, '');

    if (!code || code.trim().length == 0) unmet.push('کد ملی الزامی است');
    if (digitReplacer.length !== 10) unmet.push('کد ملی باید 10 رقم باشد');

    const nationalCode = digitReplacer;

    if (parseInt(nationalCode, 10) === 0) unmet.push('کد ملی نمیتواند تمام صفر باشد');
    if (parseInt(nationalCode.substring(3, 9), 10) === 0) unmet.push('کد ملی نامعتبر است');

    const controlDigit = parseInt(nationalCode.charAt(9), 10);
    let sum = 0;

    for (let i = 0; i < 9; i++) {
      const codeDigits = parseInt(nationalCode.charAt(i), 10);
      sum += codeDigits * (10 - i);
    }
    const remainder = sum % 11;
    const isValid =
      (remainder < 2 && controlDigit === remainder) ||
      (remainder >= 2 && controlDigit === 11 - remainder);
    if (!isValid) unmet.push('کد ملی نامعتبر است');

    return {
      isValid: unmet.length === 0,
      unmet,
    };
  }
}
