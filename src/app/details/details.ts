import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Housing } from '../housing';
import { HousingLocationInfo } from '../housing-location';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-details',
  imports: [CommonModule, ReactiveFormsModule],
  template: `<article class="gridcontainer grid grid-cols-[0.5fr_1fr] ml-[30px]">
    <section class="listing-description">
      <h2 class="listing-heading text-3xl text-gray-800 ml-1.25 mt-0.75">
        {{ housingLocation?.name }}
      </h2>
      <p class="listing-location mt-0.75 text-lg text-gray-800 ml-1.25 flex items-center gap-2">
        <img src="assets/location-pin.svg" alt="" />{{ housingLocation?.city }} ,
        {{ housingLocation?.state }}
      </p>
      <section class="descriptiongrid">
        <h2 class="listing-headingAbout text-2xl text-indigo-500 ml-1.25 mb-0">About this House</h2>
        <ul class="descriptionlist text-xl list-none p-0 ml-1.25 mt-1.25 space-y-1">
          <li class="descriptionli">Available Units: {{ housingLocation?.availableUnits }}</li>
          <li class="descriptionli">Has Wifi: {{ housingLocation?.wifi }}</li>
          <li class="descriptionli">Has Laundry: {{ housingLocation?.laundry }}</li>
        </ul>
      </section>
      <section class="form mt-1.25 space-y-2">
        <h2 class="listing-heading text-2xl text-gray-800 ml-1.25 my-4">Apply to live here</h2>
        <form [formGroup]="applyForm" (submit)="submitApplication()">
          <label for="first-name" class=" inline-block mr-2"
            >First Name :
            <input
              class="block border-2 border-solid border-black rounded p-1"
              type="text"
              id="first-name"
              formControlName="firstName"
            />
          </label>
          <label for="last-name" class=" inline-block mr-2"
            >Last Name :
            <input
              type="text"
              id="last-name"
              formControlName="lastName"
              class="block border-2 border-solid border-black rounded p-1"
            />
          </label>
          <label for="email" class=" inline-block mr-2"
            >Email:
            <input
              type="text"
              id="email"
              formControlName="email"
              class="block border-2 border-solid border-black rounded p-1"
            />
          </label>
          <button
            type="submit"
            class="submitbtn p-3 rounded-lg text-white border-none bg-indigo-500 hover:bg-indigo-600 mt-3"
          >
            Apply now
          </button>
        </form>
      </section>
    </section>
    <img
      class="listing-photo w-[500px] h-[400px] flex justify-end rounded-md"
      [src]="housingLocation?.photo"
      alt=""
    />
  </article> `,
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
