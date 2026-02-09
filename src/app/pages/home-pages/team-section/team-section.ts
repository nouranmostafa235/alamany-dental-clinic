import {Component, OnInit} from '@angular/core';
import {CarouselModule, OwlOptions} from "ngx-owl-carousel-o";
import {RouterLink} from '@angular/router';
import {DoctorsService} from '../../../services/doctors-service';

@Component({
  selector: 'app-team-section',
  imports: [
    CarouselModule,
    RouterLink
  ],
  templateUrl: './team-section.html',
  styleUrl: './team-section.css',
})
export class TeamSection implements OnInit{
  constructor(private doctorService:DoctorsService) {}
  ngOnInit() {
    this.getDoctors()
  }
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    margin: 16,
    stagePadding: 30,
    animateIn: 'fadeIn',
    animateOut: 'fadeOut',
    navSpeed: 500,
    autoplay: true,
    autoplaySpeed: 300,
    dots: false,
    navText: ['<i class="fa-solid fa-angle-right fa-xs" style="color: #ffffff;"></i>', '<i class="fa-solid fa-angle-right fa-xs" style="color: #ffffff;"></i>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 4
      },
      940: {
        items: 4
      }
    },
    nav: false
  }
  getDoctors(){
    this.doctorService.getAllDoctors().subscribe({
      next: data => {
        console.log(data);
      }
    })
  }
}
