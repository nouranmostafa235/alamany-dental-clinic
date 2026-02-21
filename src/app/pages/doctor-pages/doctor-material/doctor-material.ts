import {Component, inject} from '@angular/core';
import {CarouselModule, OwlOptions} from "ngx-owl-carousel-o";
import {DoctorsService} from '../../../services/doctors-service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-doctor-material',
  imports: [
    CarouselModule,
    AsyncPipe
  ],
  templateUrl: './doctor-material.html',
  styleUrl: './doctor-material.css',
})
export class DoctorMaterial {
  private doctorService = inject(DoctorsService);
  doctorData$ = this.doctorService.doctor$;
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
