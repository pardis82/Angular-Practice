import { Component, signal, computed } from '@angular/core';
import { TextField } from '../../text-field/text-field';
import { PassValidationService } from '../../../services/pass-validation/pass-validation';
import { UserNameValidationService } from '../../../services/user-name-validation/user-name-validation';

@Component({
  selector: 'app-sign-up-form',
  imports: [TextField],
  templateUrl: './sign-up-form.html',
})
export class SignUpForm {
  password = signal('');
  username = signal('');
  constructor(
    private passvalidation: PassValidationService,
    private usernvalidation: UserNameValidationService
  ) {}
  passwordValidation = computed(() => this.passvalidation.validatePassword(this.password()));
  usernameValidation = computed(() => this.usernvalidation.validateUsername(this.username()));

  passwordScore = computed(() => this.passwordValidation().extra.score);
  passwordColor = computed(() => this.passwordValidation().extra.color);
  passwordPercentage = computed(() => this.passwordValidation().extra.percentage);
  passwordUnmetRules = computed(() => this.passwordValidation().helper);
  usernameUnmetRules = computed(() => this.usernameValidation().unmet);
}
