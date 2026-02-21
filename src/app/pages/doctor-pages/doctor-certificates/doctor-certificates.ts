import { Component, inject} from '@angular/core';
import {CarouselModule, OwlOptions} from "ngx-owl-carousel-o";
import {DoctorsService} from '../../../services/doctors-service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-doctor-certificates',
  imports: [
    CarouselModule,
    AsyncPipe
  ],
  templateUrl: './doctor-certificates.html',
  styleUrl: './doctor-certificates.css',
})
export class DoctorCertificates{
  private doctorService = inject(DoctorsService);
  doctorData$ = this.doctorService.doctor$;
  constructor() {
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    margin: 16,
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
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  }
}
