import { Component } from '@angular/core';

import { RouterLink, RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, RouterModule],
  template: `<main>
    <a [routerLink]="['/']">
      <header class="brand-name mb-5 px-20 py-5 bg-gray-100">
        <img class="brand-logo -ml-10" src="assets/logo.svg" alt="Logo" />
      </header>
    </a>

    <section class="content">
      <router-outlet></router-outlet>
    </section>
  </main>`,
})
export class App {
  title = 'homes';
}
