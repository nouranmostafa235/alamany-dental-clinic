import {Component, Inject, PLATFORM_ID} from '@angular/core';
import {CarouselModule, OwlOptions} from 'ngx-owl-carousel-o';
import {NavBar} from '../../nav-bar/nav-bar';
import {RouterLink} from '@angular/router';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-home-section',
  imports: [
    CarouselModule,
    NavBar,
    RouterLink
  ],
  templateUrl: './home-section.html',
  styleUrl: './home-section.css',
})
export class HomeSection {
  isBrowser = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
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
    navText: [
      '<i class="fa-solid fa-angle-left"></i>',
      '<i class="fa-solid fa-angle-right"></i>'
    ]   ,
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
