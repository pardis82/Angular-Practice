import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingLocation } from '../housing-location/housing-location';
import { HousingLocationInfo } from '../housing-location';
import { Housing } from '../housing';

@Component({
  selector: 'app-home',
  imports: [CommonModule, HousingLocation],
  template: `<section>
      <form>
        <input class="inputFilter" type="text" placeholder="Filter by city" #filter />
        <button type="button" class="primary" (click)="filterResults(filter.value)">Serach</button>
      </form>
    </section>
    <section class="results">
      @for(housingLocation of filteredHousingLocationList; track $index) {
      <app-housing-location [housingLocation]="housingLocation" />
      }
    </section>`,
  styleUrls: ['./home.css'],
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
