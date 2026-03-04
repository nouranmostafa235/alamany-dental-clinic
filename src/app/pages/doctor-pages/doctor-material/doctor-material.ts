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
  activeImage: string | null = null;

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 400,
    navText: ['&#8249;', '&#8250;'],
    nav: true,
    responsive: {
      0:   { items: 1 },
      600: { items: 2 },
      900: { items: 3 },
    },
  };
  openImage(url: string): void {
    this.activeImage = url;
    document.body.style.overflow = 'hidden';
  }

  closeImage(): void {
    this.activeImage = null;
    document.body.style.overflow = '';
  }
}
