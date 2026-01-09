import {Component, AfterViewInit, Inject, PLATFORM_ID} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {isPlatformBrowser} from '@angular/common';
@Component({
  selector: 'app-book-now-section',
  imports: [],
  templateUrl: './book-now-section.html',
  styleUrl: './book-now-section.css',
})
export class BookNowSection implements AfterViewInit{
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }
  ngAfterViewInit(){
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(".book-gsap", {
      scrollTrigger: {
        trigger: ".book-gsap",
        start: "top 80%",
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });
    gsap.from(".gsap-cover", {
      scrollTrigger: {
        trigger: ".gsap-cover",
        start: "top 80%",
      },
      x: 80,
      opacity: 0,
      duration: 1.2,
      delay: 0.2,
      ease: 'power3.out'
    });
  }
}
