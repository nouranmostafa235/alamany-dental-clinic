import { Component } from '@angular/core';
import {CarouselModule, OwlOptions} from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-home-section',
  imports: [
    CarouselModule
  ],
  templateUrl: './home-section.html',
  styleUrl: './home-section.css',
})
export class HomeSection {
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    autoplay: true,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    autoplaySpeed: 3000,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['<i class="fa-solid fa-angle-right fa-xs" style="color: #ffffff;"></i>', '<i class="fa-solid fa-angle-right fa-xs" style="color: #ffffff;"></i>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  }
}
