import { Component, signal, computed } from '@angular/core';
import { TextField } from '../../text-field/text-field';
import { PassValidationService } from '../../../services/pass-validation/pass-validation';
import { UserNameValidationService } from '../../../services/user-name-validation/user-name-validation';

@Component({
  selector: 'app-login-form',
  imports: [TextField],
  templateUrl: './login-form.html',
})
export class LoginForm {
  password = signal('');
  username = signal('');
  constructor(
    private passvalidation: PassValidationService,
    private usernvalidation: UserNameValidationService
  ) {}
  passwordValidation = computed(() => this.passvalidation.validatePassword(this.password()));
  usernameValidation = computed(() => this.usernvalidation.validateUsername(this.username()));
  // passwordError = computed(() => (this.passwordValidation().valid ? '' : 'invalid'));
  usernameError = computed(() =>
    this.usernameValidation().valid ? '' : this.usernameValidation().unmet[0]
  );

  passwordScore = computed(() => this.passwordValidation().extra.score);
  passwordColor = computed(() => this.passwordValidation().extra.color);
  passwordPercentage = computed(() => this.passwordValidation().extra.percentage);
  passwordUnmetRules = computed(() => this.passwordValidation().helper);
  usernameUnmetRules = computed(() => this.usernameValidation().unmet);

  isFormValid = computed(
    () => this.username().trim().length > 0 && this.password().trim().length > 0
  );

  onSubmit(event:Event) {
  event.preventDefault()
    if (this.isFormValid()) {
      console.log('login Successful', {
        username: this.username(),
        password: this.password(),
      });
    }
  }
}
