import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  imports: [CommonModule],
  template: `
    <div class="scene" [style.--size.px]="size" [style.width.px]="size" [style.height.px]="size">
      <div class="logo-container">
        <img src="/assets/logo.png" alt="DPT Logo" class="logo-image">
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    .scene {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .logo-container {
      width: 100%;
      height: 100%;
      position: relative;
    }

    .logo-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
    }
  `]
})
export class LogoComponent {
  @Input() size: number = 40;
}
