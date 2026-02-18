import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <h1 style="color: white; z-index: 9999; position: relative;">APP ROOT LOADED</h1>
    <router-outlet />
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class App {
}
