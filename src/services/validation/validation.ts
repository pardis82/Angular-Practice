import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor() {}

  // ---------------------
  // PASSWORD VALIDATION
  // ---------------------
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
    if (!requirements.hasSpecialCharacters) unmet.push('•  یکی از این کاراکتر ها (@ # $ % ! ?)');
    if (!requirements.isLengthy) unmet.push('•  حداقل 8 کاراکتر');

    return { requirements, score, unmet };
  }

  getPasswordStrengthColor(score: number): string {
    if (score <= 1) return 'bg-red-600';
    if (score === 2) return 'bg-yellow-400';
    if (score === 3) return 'bg-orange-300';
    if (score === 4) return 'bg-orange-500';
    return 'bg-green-400';
  }

  getPasswordStrengthPercentage(score: number): number {
    return (score / 5) * 100;
  }

  // ---------------------
  // NATIONAL CODE VALIDATION
  // ---------------------
  validateNationalCode(code: string): boolean {
    // must be exactly 10 digits and no letters
    return /^[0-9]{10}$/.test(code);
  }

  // ---------------------
  // PHONE NUMBER VALIDATION
  // ---------------------
  validatePhoneNumber(phone: string): boolean {
    // Remove spaces or non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    // Must be exactly 10 digits, cannot start with 0
    return /^[1-9][0-9]{9}$/.test(digitsOnly);
  }

  formatPhoneNumber(phone: string, prefix: string = '+98'): string {
    // remove non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    return `${prefix}${digitsOnly}`;
  }

  // ---------------------
  // EMAIL VALIDATION
  // ---------------------
  validateEmail(email: string): boolean {
    // Basic email format check
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // async method to check if email exists (requires backend)
  async checkEmailExists(email: string): Promise<boolean> {
    // Example placeholder logic:
    // return await this.http.get(`/api/users/check-email?email=${email}`);
    // For now, just return false
    return false;
  }
}
