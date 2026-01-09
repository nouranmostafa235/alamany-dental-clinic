import {Component, AfterViewInit, PLATFORM_ID, Inject} from '@angular/core';
import {CarouselModule} from "ngx-owl-carousel-o";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {isPlatformBrowser} from '@angular/common';
@Component({
  selector: 'app-contact-section',
    imports: [
        CarouselModule
    ],
  templateUrl: './contact-section.html',
  styleUrl: './contact-section.css',
})
export class ContactSection implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.gsap-contact', {
      scrollTrigger: {
        trigger: '.gsap-contact',
        start: 'top 70%',
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });
  }
}
