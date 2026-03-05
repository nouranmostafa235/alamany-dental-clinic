import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, PLATFORM_ID } from '@angular/core';
import { NavBar } from '../../nav-bar/nav-bar';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { SwiperOptions } from 'swiper/types';
import { SwiperDirective } from '../../../directives/swiper.directive';

@Component({
  selector: 'app-home-section',
  imports: [
    NavBar,
    RouterLink,
    SwiperDirective
  ],
  templateUrl: './home-section.html',
  styleUrl: './home-section.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeSection {
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  swiperConfig: SwiperOptions = {
    loop: true,
    autoplay: { delay: 4000, disableOnInteraction: false },
    effect: 'fade',
    speed: 800,
  };
}
