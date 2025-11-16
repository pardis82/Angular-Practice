import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  template: `
  <section>
    <form >

    <input type="text" placeholder="enter a name">
    <button type="button">Serach</button>
    </form>
  </section>
  `,
  styleUrls: ['./home.css'],
})
export class Home {

}
