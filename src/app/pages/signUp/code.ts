import { Component } from '@angular/core';
import { VerificationCode } from '../../verification-code/verification-code';
import { Router } from '@angular/router';
@Component({
  selector: 'code-page',
  imports: [VerificationCode],
  template: `
    <div dir="ltr" class="flex justify-center">
      <app-verification-code
        [boxNumber]="5"
        [maxLength]="3"
        [verificationCode]="'123456789101112'"
        (verificationComplete)="handleVerification($event)"
      ></app-verification-code>
    </div>
  `,
})
export class CodePage {
  constructor(private router: Router) {}
  handleVerification(result: { success: boolean; code: string }): void {
    if (result.success) {
      setTimeout(() => {
        this.router.navigate(['/userProfile']);
      }, 1000);
    }
  }
}
