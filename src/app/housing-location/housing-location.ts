import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingLocationInfo } from '../housing-location';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-housing-location',
  imports: [CommonModule, RouterLink, RouterModule],
  template: `
    <section
      class="listing flex flex-col items-center p-2.5 ml-[75px] mt-5 w-[300px] bg-indigo-300 rounded-lg"
    >
      <img
        class="listing-photo w-full h-[300px] object-cover"
        [src]="housingLocation().photo"
        alt="Photo of {{ housingLocation().name }}"
      />

      <h2 class="listing-heading text-lg text-white font-serif mt-2">
        {{ housingLocation().name }}
      </h2>
      <p class="listing-location mt-1 text-gray-100 text-sm font-serif">
        {{ housingLocation().city }} , {{ housingLocation().state }}
      </p>
      <a
        class="details mb-1 text-green-800 underline font-serif text-sm"
        [routerLink]="['/details', housingLocation().id]"
        >Learn More</a
      >
    </section>
  `,
})
export class HousingLocation {
  housingLocation = input.required<HousingLocationInfo>();
}
