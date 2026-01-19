import {Component, AfterViewInit, Inject, PLATFORM_ID} from '@angular/core';
import {CarouselModule, OwlOptions} from "ngx-owl-carousel-o";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {isPlatformBrowser} from '@angular/common';
@Component({
  selector: 'app-reviews-section',
    imports: [
        CarouselModule
    ],
  templateUrl: './reviews-section.html',
  styleUrl: './reviews-section.css',
})
export class ReviewsSection implements AfterViewInit {
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
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }
  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.gsap-review', {
      scrollTrigger: {
        trigger: '.gsap-review',
        start: 'top 70%',
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });
  }
}
