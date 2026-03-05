import { Component, Inject, OnInit, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Router } from '@angular/router';
import { DoctorsService } from '../../../services/doctors-service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-team-section',
  imports: [CarouselModule],
  templateUrl: './team-section.html',
  styleUrl: './team-section.css',
})
export class TeamSection implements OnInit {
  allDoctors: any[] = [];
  isBrowser = false;

  constructor(
    private doctorService: DoctorsService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Defer setting isBrowser by one tick so Owl initialises
    // after Angular's first change detection pass — prevents NG0100
    setTimeout(() => {
      this.isBrowser = true;
      this.cdr.detectChanges(); // tell Angular about the change immediately
      this.getDoctors();
    }, 0);
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    margin: 16,
    stagePadding: 30,
    // animateIn / animateOut removed — they conflict with multi-item
    // responsive configs and cause the ExpressionChangedAfterChecked error
    navSpeed: 500,
    autoplay: true,
    autoplayTimeout: 3000,   // controls how long each slide shows (ms)
    autoplaySpeed: 500,      // controls the transition speed (ms)
    dots: false,
    navText: [
      '<i class="fa-solid fa-angle-left fa-xs" style="color:#ffffff"></i>',
      '<i class="fa-solid fa-angle-right fa-xs" style="color:#ffffff"></i>',
    ],
    responsive: {
      0:   { items: 1 },
      480: { items: 2 },
      740: { items: 3 },
      940: { items: 4 },
    },
    nav: false,
  };

  getDoctors(): void {
    this.doctorService.getAllDoctors().subscribe({
      next: (data) => {
        this.allDoctors = data.data;
        this.cdr.detectChanges(); // re-render once doctors arrive
      },
    });
  }

  navigate(doctorId: any): void {
    this.router.navigate(['/doctor-profile', doctorId], {
      state: { returnUrl: this.router.url },
    });
  }
}
