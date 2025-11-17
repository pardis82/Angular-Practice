import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingLocationInfo } from '../housing-location';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-housing-location',
  imports: [CommonModule, RouterLink, RouterModule],
  template: `
    <section class="listing">
      <img
        class="listing-photo"
        [src]="housingLocation().photo"
        alt="Photo of {{ housingLocation().name }}"
      />

      <h2 class="listing-heading">{{ housingLocation().name }}</h2>
      <p class="listing-location">{{ housingLocation().city }} , {{ housingLocation().state }}</p>
      <a routerLink="details">see more</a>
    </section>
  `,
  styleUrl: './housing-location.css',
})
export class HousingLocation {
  housingLocation = input.required<HousingLocationInfo>();
}
