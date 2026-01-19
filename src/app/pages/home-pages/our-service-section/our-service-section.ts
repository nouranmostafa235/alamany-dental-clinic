import {Component, AfterViewInit, Inject, PLATFORM_ID, OnInit, OnDestroy} from '@angular/core';
import {CarouselModule} from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {isPlatformBrowser} from '@angular/common';
import {OurServicesService} from '../../../services/our-services-service';

@Component({
  selector: 'app-our-service-section',
  imports: [CarouselModule],
  templateUrl: './our-service-section.html',
  styleUrl: './our-service-section.css',
})
export class OurServiceSection implements AfterViewInit , OnInit , OnDestroy {
  constructor(@Inject(PLATFORM_ID) private platformId: Object , private service: OurServicesService) {}
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
        items: 2
      },
      940: {
        items: 2
      }
    },
    nav: false
  }
  allServices: any[] =[]
  private ctx!: gsap.Context;
  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.getAll()
    gsap.registerPlugin(ScrollTrigger);
    this.ctx = gsap.context(()=>{
      gsap.from('.gsap-title', {
        scrollTrigger: {
          trigger: '.service-wrapper',
          start: 'top 70%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
      gsap.from('.gsap-image', {
        scrollTrigger: {
          trigger: '.service-wrapper',
          start: 'top 70%',
        },
        x: 80,
        opacity: 0,
        duration: 1.2,
        delay: 0.2,
        ease: 'power3.out'
      });
    })
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }

  ngAfterViewInit() {
  }

  ngOnDestroy(): void {
    if(this.ctx)
    this.ctx.revert();
  }
  getAll(){
    this.service.getServices().subscribe({
      next: data => {
        this.allServices = data.data.services
        console.log(this.allServices)
      }
    })
  }
}
