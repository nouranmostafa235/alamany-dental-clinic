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
  totalNoOfRatings: number = 0;
  platformId  = inject(PLATFORM_ID)
  constructor(private doctorService: DoctorsService, private cdr: ChangeDetectorRef) {
  }
  ngOnInit() {
    if(!isPlatformBrowser(this.platformId)){
      return;
    }
    this.doctorService.doctor$.subscribe(doctor => {
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
      this.allReviews = reviews.data;
      this.totalNoOfRatings = reviews.pagination.total;
      this.cdr.detectChanges();
      console.log(reviews.pagination.total);
    })
  }
  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }
}
