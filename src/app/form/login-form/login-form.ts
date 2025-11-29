import { Component, signal, computed, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TextField } from '../../text-field/text-field';
import { PassValidationService } from '../../../services/pass-validation/pass-validation';
import { UserNameValidationService } from '../../../services/user-name-validation/user-name-validation';

@Component({
  selector: 'app-login-form',
  imports: [TextField, ReactiveFormsModule],
  templateUrl: './login-form.html',
})
export class LoginForm implements OnInit {
  loginForm!: FormGroup;
  formValid = signal(false); // Use a signal for form validity

  constructor(
    private fb: FormBuilder,
    private passvalidation: PassValidationService,
    private usernvalidation: UserNameValidationService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    // Listen to form status changes
    this.loginForm.statusChanges.subscribe(() => {
      this.formValid.set(this.loginForm.valid);
    });

    // Initial check
    this.formValid.set(this.loginForm.valid);
  }

  
  passwordValidation = computed(() =>
    this.passvalidation.validatePassword(this.loginForm?.get('password')?.value || '')
  );

  usernameValidation = computed(() =>
    this.usernvalidation.validateUsername(this.loginForm?.get('username')?.value || '')
  );

  usernameError = computed(() =>
    this.usernameValidation().valid ? '' : this.usernameValidation().unmet[0]
  );

  passwordScore = computed(() => this.passwordValidation().extra.score);
  passwordColor = computed(() => this.passwordValidation().extra.color);
  passwordPercentage = computed(() => this.passwordValidation().extra.percentage);
  passwordUnmetRules = computed(() => this.passwordValidation().helper);
  usernameUnmetRules = computed(() => this.usernameValidation().unmet);

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('login Successful', this.loginForm.value);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}