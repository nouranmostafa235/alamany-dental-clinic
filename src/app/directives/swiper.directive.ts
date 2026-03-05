// src/app/directives/swiper.directive.ts
import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  input,
  InputSignal,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';

@Directive({ selector: '[appSwiper]', standalone: true })
export class SwiperDirective implements AfterViewInit {
  readonly #platformId = inject(PLATFORM_ID);
  swiperElement: SwiperContainer = inject(ElementRef).nativeElement;
  swiperOptions: InputSignal<SwiperOptions> = input.required<SwiperOptions>();

  ngAfterViewInit(): void {
    Object.assign(this.swiperElement, this.swiperOptions());
    // Guard: only initialize in the browser, never on the server (SSR fix)
    if (isPlatformBrowser(this.#platformId)) {
      this.swiperElement.initialize();
    }
  }
}
