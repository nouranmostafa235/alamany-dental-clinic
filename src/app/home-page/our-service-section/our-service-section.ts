import {Component, signal} from '@angular/core';
import {CarouselModule} from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';
@Component({
  selector: 'app-our-service-section',
  imports: [CarouselModule],
  templateUrl: './our-service-section.html',
  styleUrl: './our-service-section.css',
})
export class OurServiceSection {
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    autoplay: true,
    animateIn: 'fadeIn',
    animateOut: 'fadeOut',
    margin: 16,
    stagePadding: 30,
    dots: true,
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
        items: 3
      },
      940: {
        items: 3
      }
    },
    nav: false
  }
  // slidesStore = signal<any[]>([
  //   { id: 'slide-1',src:'img/logo.jpeg', text: 'Slide 1 HM', dataMerge: 2, width: 300, dotContent: 'text1' },
  //   { id: 'slide-2',src:'img/logo.jpeg', text: 'Slide 2 HM', dataMerge: 1, width: 500, dotContent: 'text2' },
  //   { id: 'slide-3',src:'img/logo.jpeg', text: 'Slide 3 HM', dataMerge: 3, width: 500, dotContent: 'text3' },
  //   { id: 'slide-4',src:'img/logo.jpeg',   text: 'Slide 4 HM', width: 450, dotContent: 'text4' },
  //   { id: 'slide-5',src:'img/logo.jpeg',  text: 'Slide 5 HM', dataMerge: 2, width: 500, dotContent: 'text5' },
  //   { id: 'slide-6',src:'img/logo.jpeg',  text: 'Slide 6', width: 500, dotContent: 'text5' },
  //   { id: 'slide-7',src:'img/logo.jpeg',  text: 'Slide 7', width: 500, dotContent: 'text6' },
  //   { id: 'slide-8',src:'img/logo.jpeg',  text: 'Slide 8', width: 500, dotContent: 'text8' },
  //   // { id: 'slide-7', text: 'Slide 7', dotContent: 'text5'},
  //   // { id: 'slide-8', text: 'Slide 8', dotContent: 'text5'},
  //   // { id: 'slide-9', text: 'Slide 9', dotContent: 'text5'},
  //   // { id: 'slide-10', text: 'Slide 10', dotContent: 'text5'},
  // ]);
}
