import {Component, inject, OnInit} from '@angular/core';
import {CarouselModule, OwlOptions} from "ngx-owl-carousel-o";
import {DoctorsService} from '../../../services/doctors-service';
import {AsyncPipe} from '@angular/common';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-doctor-certificates',
  imports: [
    CarouselModule,
    AsyncPipe
  ],
  templateUrl: './doctor-certificates.html',
  styleUrl: './doctor-certificates.css',
})
export class DoctorCertificates implements OnInit{

  activeImage: { url: string; issuer: string } | null = null;
  private doctorService = inject(DoctorsService);
  doctorData$ = this.doctorService.doctor$;
  constructor(
    private route: ActivatedRoute,
  ) {}
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
  ngOnInit() {

  }
  openImage(url: string, issuer: string): void {
    this.activeImage = { url, issuer };
    document.body.style.overflow = 'hidden';
  }

  closeImage(): void {
    this.activeImage = null;
    document.body.style.overflow = '';
  }

  protected readonly length = length;
}
