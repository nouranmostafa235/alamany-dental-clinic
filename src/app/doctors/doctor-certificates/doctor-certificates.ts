import { Component } from '@angular/core';
import {CarouselModule, OwlOptions} from "ngx-owl-carousel-o";

@Component({
  selector: 'app-doctor-certificates',
    imports: [
        CarouselModule
    ],
  templateUrl: './doctor-certificates.html',
  styleUrl: './doctor-certificates.css',
})
export class DoctorCertificates {
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
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
        items: 2
      },
      940: {
        items: 2
      }
    },
    nav: false
  }
}
