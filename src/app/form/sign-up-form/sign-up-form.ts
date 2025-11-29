import { Component, signal, computed, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TextField } from '../../text-field/text-field';
import { PassValidationService } from '../../../services/pass-validation/pass-validation';
import { UserNameValidationService } from '../../../services/user-name-validation/user-name-validation';
import { NationalCodeValidation } from '../../../services/nationalcode-validation/national-code-validation';

@Component({
  selector: 'app-sign-up-form',
  imports: [TextField, ReactiveFormsModule],
  templateUrl: './sign-up-form.html',
})
export class SignUpForm implements OnInit {
  signUpForm!: FormGroup;
  formValid = signal(false);

  // Create signals for form values to trigger computed updates
  formValues = signal({
    username: '',
    password: '',
    nationalcode: '',
  });

  constructor(
    private fb: FormBuilder,
    private passvalidation: PassValidationService,
    private usernvalidation: UserNameValidationService,
    private nationalcodevalidation: NationalCodeValidation
  ) {}

  ngOnInit() {
    this.signUpForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      nationalcode: ['', [Validators.required]],
    });

    // Listen to form value changes and update the signal
    this.signUpForm.valueChanges.subscribe((values) => {
      this.formValues.set({
        username: values.username || '',
        password: values.password || '',
        nationalcode: values.nationalcode || '',
      });
    });
  }

  // Update computed properties to use the formValues signal
  passwordValidation = computed(() =>
    this.passvalidation.validatePassword(this.formValues().password)
  );

  usernameValidation = computed(() =>
    this.usernvalidation.validateUsername(this.formValues().username)
  );

  nationalcvalidation = computed(() =>
    this.nationalcodevalidation.validateNationalCode(this.formValues().nationalcode)
  );

  passwordScore = computed(() => this.passwordValidation().extra.score);
  passwordColor = computed(() => this.passwordValidation().extra.color);
  passwordPercentage = computed(() => this.passwordValidation().extra.percentage);
  passwordUnmetRules = computed(() => this.passwordValidation().helper);
  usernameUnmetRules = computed(() => this.usernameValidation().unmet);
  nationalUnmetRules = computed(() => this.nationalcvalidation().unmet);
}
