import {ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID} from '@angular/core';
import {CarouselModule, OwlOptions} from "ngx-owl-carousel-o";
import {DoctorsService} from '../../../services/doctors-service';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-doctor-review',
    imports: [
        CarouselModule
    ],
  templateUrl: './doctor-review.html',
  styleUrl: './doctor-review.css',
})
export class DoctorReview implements OnInit{
  doctorData: any;
  allReviews: any = [];
  totalNoOfRatings: any;
  overAllRate = 0
  platformId  = inject(PLATFORM_ID)
  constructor(private doctorService: DoctorsService, private cdr: ChangeDetectorRef) {
  }
  ngOnInit() {
    if(!isPlatformBrowser(this.platformId)){
      return;
    }
    this.doctorService.doctor$.subscribe(doctor => {
      if (!doctor) return;
      this.doctorData = doctor;
      this.getReviews(this.doctorData._id)

    })

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
        items: 2
      },
      940: {
        items: 2
      }
    },
    nav: false
  }
  getReviews(id:any){
    this.doctorService.getReviews(id).subscribe(reviews => {
      this.allReviews = reviews?.data?.reviews;
      this.overAllRate = parseFloat(reviews?.data?.ratingData?.averageRating?.toFixed(1));
      this.totalNoOfRatings = this.formatRating(reviews?.data?.ratingData?.totalRatings) ;
      this.cdr.detectChanges();
    })
  }
 formatRating(value: number): string {
    if (Number.isInteger(value)) return value.toString();
    return value.toFixed(1);
  }
  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }
  getRate(rating: number): string[] {
    const stars: string[] = [];
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;

    for (let i = 0; i < full; i++) stars.push('fa-star');
    for (let i = 0; i < half; i++) stars.push('fa-star-half-stroke');
    for (let i = 0; i < empty; i++) stars.push('fa-star empty');

    return stars;
  }
}
