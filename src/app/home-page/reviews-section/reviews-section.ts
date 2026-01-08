import { Component } from '@angular/core';
import {CarouselModule, OwlOptions} from "ngx-owl-carousel-o";

@Component({
  selector: 'app-reviews-section',
    imports: [
        CarouselModule
    ],
  templateUrl: './reviews-section.html',
  styleUrl: './reviews-section.css',
})
export class ReviewsSection {
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    autoplay: true,
   // slideTransition:'fade',
    margin: 16,
    stagePadding: 30,
    dots: true,
    navSpeed: 900,
    autoplaySpeed:900,
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
