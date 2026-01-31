import {AfterViewInit, Component, Inject, PLATFORM_ID} from '@angular/core';
import {HomeSection} from './home-section/home-section';
import {CounterSection} from './counter-section/counter-section';
import {OurServiceSection} from './our-service-section/our-service-section';
import {TeamSection} from './team-section/team-section';
import {ContactSection} from './contact-section/contact-section';
import {Footer} from '../../shared-components/footer/footer';
import {ReviewsSection} from './reviews-section/reviews-section';
import {BookNowSection} from './book-now-section/book-now-section';
import {ActivatedRoute, Router} from '@angular/router';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-home-page',
  imports: [
    HomeSection,
    CounterSection,
    OurServiceSection,
    TeamSection,
    ContactSection,
    Footer,
    ReviewsSection,
    BookNowSection
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements AfterViewInit {
  sections = [
    'home',
    'team',
    'services',
    'reviews',
    'contact'
  ];
  private isAutoScrolling = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.route.fragment.subscribe(fragment => {
      if (!fragment) return;
      this.isAutoScrolling = true;
      setTimeout(() => {
        const el = document.getElementById(fragment);
        if (!el) return;

        const offset = 100;
        const y =
          el.getBoundingClientRect().top +
          window.scrollY -
          offset;

        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
        setTimeout(() => {
          this.isAutoScrolling = false;
        }, 600);
      }, 300);
    });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.isAutoScrolling) {
            const id = entry.target.id;

            this.router.navigate([], {
              fragment: id,
              replaceUrl: true
            });
          }
        });
      },
      {
        root: null,
        threshold: 0.6
      }
    );
    this.sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }
}
