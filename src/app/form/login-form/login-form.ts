import { Component, signal, computed } from '@angular/core';
import { TextField } from '../../text-field/text-field';
import { PassValidationService } from '../../../services/pass-validation/pass-validation';

@Component({
  selector: 'app-login-form',
  imports: [TextField],
  templateUrl: './login-form.html',
})
export class LoginForm {
  password = signal('');
  username = signal('');
  constructor(private passvalidation: PassValidationService) {}
  passwordValidation = computed(() => this.passvalidation.validatePassword(this.password()));
  passwordError = computed(() => (this.passwordValidation().valid ? '' : 'معتبر نیست'));

  passwordScore = computed(() => this.passwordValidation().extra.score);
  passwordColor = computed(() => this.passwordValidation().extra.color);
  passwordPercentage = computed(() => this.passwordValidation().extra.percentage);
  passwordUnmetRules = computed(() => this.passwordValidation().helper);
}
