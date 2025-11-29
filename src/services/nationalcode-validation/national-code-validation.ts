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
    const length = code.length;

    if (!code || code.trim().length == 0) unmet.push('کد ملی الزامی است');
    if (length !== 10) unmet.push('کد ملی باید 10 رقم باشد');

    return {
      isValid: unmet.length === 0,
      unmet,
    };
  }
}
