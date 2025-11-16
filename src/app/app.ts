import { Component } from '@angular/core';
import {Home} from './home/home'

@Component({
  selector: 'app-root',
  imports: [Home],
  template: `
<main>
 
 <section class="content">
<app-home></app-home>
 </section>
</main>

  `,
  styleUrls: ['./app.css'],
})
export class App {
  title = 'homes';
}
