import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingLocation } from '../housing-location/housing-location';
import { HousingLocationInfo } from '../housing-location';
import { Housing } from '../housing';
import { RouterLink, RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, HousingLocation, RouterLink, RouterOutlet, RouterModule],
  template: `<section>
      <form>
        <input
          class="inputFilter border-2 border-solid border-purple-500 focus:outline-purple-600 rounded-lg p-3 pr-40 mr-1 ml-20 mt-5"
          type="text"
          placeholder="Filter by city"
          #filter
        />
        <button
          type="button"
          class="primary bg-purple-500 p-3.5 border-none text-white rounded-lg cursor-pointer hover:bg-purple-600"
          (click)="filterResults(filter.value)"
        >
          Serach
        </button>
      </form>
    </section>
    <section
      class="results grid grid-cols-5 gap-2.5 gap-x-0.5 py-1.25 px-0"
      style="grid-template-columns: repeat(5, 350px)"
    >
      @for(housingLocation of filteredHousingLocationList; track $index) {
      <app-housing-location [housingLocation]="housingLocation" />
      }
      <a
        class=" inline-block mx-20 text-blue-500 underline underline-offset-3"
        [routerLink]="'/form'"
        >Click to go to form</a
      >
    </section> `,
})
export class Home {
  readonly baseUrl = 'assets';
  housingLocationList: HousingLocationInfo[] = [];
  housingService: Housing = inject(Housing);
  filteredHousingLocationList: HousingLocationInfo[] = [];
  constructor() {
    this.housingService
      .getAllHousingLocations()
      .then((housingLocationList: HousingLocationInfo[]) => {
        this.housingLocationList = housingLocationList;
        this.filteredHousingLocationList = housingLocationList;
      });
  }
  filterResults(text: string) {
    if (!text) this.filteredHousingLocationList = this.housingLocationList;
    this.filteredHousingLocationList = this.housingLocationList.filter((housingLocation) =>
      housingLocation?.city.toLowerCase().includes(text.toLowerCase())
    );
  }
}
