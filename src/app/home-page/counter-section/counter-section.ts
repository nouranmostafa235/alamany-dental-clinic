import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, PLATFORM_ID, ViewChild} from '@angular/core';
import gsap from 'gsap';
import MotionPathPlugin from 'gsap/MotionPathPlugin';
import DrawSVGPlugin from 'gsap/DrawSVGPlugin';
import ScrollTrigger from 'gsap/ScrollTrigger';
import {isPlatformBrowser} from '@angular/common';
@Component({
  selector: 'app-counter-section',
  imports: [],
  templateUrl: './counter-section.html',
  styleUrl: './counter-section.css',
})
export class CounterSection implements AfterViewInit,OnDestroy {
  @ViewChild('svgSection') svgSection!: ElementRef;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  svgs = [
    {
      viewBox: '0 0 24 24',
      path: '   M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z\n',
      stroke: '#042D3C',
      title: 'Layers',
      description: 'Gentle, Judgement Free Care'
    },
    {
      viewBox: '0 0 24 24',
      path: 'M3 9H21M7 3V5M17 3V5M6 13H8M6 17H8M11 13H13M11 17H13M16 13H18M16 17H18M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z',
      stroke: '#042D3C',
      title: 'Fast',
      description: 'Short Notice & Emergency Availability'
    },
    {
      viewBox: '0 0 24 24',
      path: 'M7 8.5H10.5M13.75 14H17.25M13.75 16.5H17.25M6.75 15.25H10.75M8.75 17.25V13.25M14.1001 7L16.9285 9.82843M14.1001 9.82861L16.9285 7.00019M6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4Z',
      stroke: '#042D3C',
      title: 'Verified',
      description: 'Third Party Financing Available'
    },
    {
      viewBox: '0 0 24 24',
      path: 'M4 21C4 17.4735 6.60771 14.5561 10 14.0709M16.4976 16.2119C15.7978 15.4328 14.6309 15.2232 13.7541 15.9367C12.8774 16.6501 12.7539 17.843 13.4425 18.6868C13.8312 19.1632 14.7548 19.9983 15.4854 20.6353C15.8319 20.9374 16.0051 21.0885 16.2147 21.1503C16.3934 21.203 16.6018 21.203 16.7805 21.1503C16.9901 21.0885 17.1633 20.9374 17.5098 20.6353C18.2404 19.9983 19.164 19.1632 19.5527 18.6868C20.2413 17.843 20.1329 16.6426 19.2411 15.9367C18.3492 15.2307 17.1974 15.4328 16.4976 16.2119ZM15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z',
      stroke: '#042D3C',
      title: 'Refresh',
      description: 'Thousands of Happy Patients'
    },
    {
      viewBox: '0 0 24 24',
      path: 'M12 20H16M12 20H8M12 20V16M12 16H5C4.44772 16 4 15.5523 4 15V6C4 5.44771 4.44772 5 5 5H19C19.5523 5 20 5.44772 20 6V15C20 15.5523 19.5523 16 19 16H12Z',
      stroke: '#042D3C',
      title: 'Refresh',
      description: 'Industry Leading Technology'
    },

  ];
  ngAfterViewInit(): void {
    // Only run animations in the browser
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Reset all SVG paths to initial state
    const paths = this.svgSection.nativeElement.querySelectorAll('.svg-path');
    paths.forEach((path: SVGPathElement) => {
      gsap.set(path, { strokeDashoffset: 1000 });
    });

    // Animate each SVG path


    paths.forEach((path: SVGPathElement, index: number) => {
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 7,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: path,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        delay: index * 0.2 // Stagger effect
      });
    });

    // Animate the containers
    const svgItems = this.svgSection.nativeElement.querySelectorAll('.svg-item');

    gsap.from(svgItems, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.2,
      scrollTrigger: {
        trigger: this.svgSection.nativeElement,
        start: 'top 70%',
        toggleActions: 'play none none none'
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up ScrollTrigger instances to prevent memory leaks
    if (isPlatformBrowser(this.platformId)) {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }
}
}
