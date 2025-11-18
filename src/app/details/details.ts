import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Housing } from '../housing';
import { HousingLocationInfo } from '../housing-location';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-details',
  imports: [CommonModule, ReactiveFormsModule],
  template: `<article class="gridcontainer">
    <section class="listing-description">
      <h2 class="listing-heading">{{ housingLocation?.name }}</h2>
      <p class="listing-location">
        <img src="assets/location-pin.svg" alt="" />{{ housingLocation?.city }} ,
        {{ housingLocation?.state }}
      </p>
      <section class="descriptiongrid">
        <h2 class="listing-headingAbout">About this House</h2>
        <ul class="descriptionlist">
          <li class="descriptionli">Available Units: {{ housingLocation?.availableUnits }}</li>
          <li class="descriptionli">Has Wifi: {{ housingLocation?.wifi }}</li>
          <li class="descriptionli">Has Laundry: {{ housingLocation?.laundry }}</li>
        </ul>
      </section>
      <section class="form">
        <h2 class="listing-heading">Apply to live here</h2>
        <form [formGroup]="applyForm" (submit)="submitApplication()">
          <label for="first-name"
            >First Name :
            <input type="text" id="first-name" formControlName="firstName" />
          </label>
          <label for="last-name"
            >Last Name :
            <input type="text" id="last-name" formControlName="lastName" />
          </label>
          <label for="email"
            >Email:
            <input type="text" id="email" formControlName="email" />
          </label>
          <button type="submit" class="submitbtn">Apply now</button>
        </form>
      </section>
    </section>
    <img class="listing-photo" [src]="housingLocation?.photo" alt="" />
  </article> `,
  styleUrl: './details.css',
})
export class Details {
  route: ActivatedRoute = inject(ActivatedRoute);
  housingService = inject(Housing);
  housingLocation: HousingLocationInfo | undefined;
  applyForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
  });
  constructor() {
    const housingLocationId = Number(this.route.snapshot.params['id']);
    this.housingService.getHousingLocationByID(housingLocationId).then((housinglocation) => {
      this.housingLocation = housinglocation;
    });
  }
  submitApplication() {
    this.housingService.submitApplication(
      this.applyForm.value.firstName ?? '',
      this.applyForm.value.lastName ?? '',
      this.applyForm.value.email ?? ''
    );
  }
}
