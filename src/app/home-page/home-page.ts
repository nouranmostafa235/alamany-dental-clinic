import { Component } from '@angular/core';
import {NavBar} from '../nav-bar/nav-bar';
import {HomeSection} from './home-section/home-section';
import {CounterSection} from './counter-section/counter-section';
import {OurServiceSection} from './our-service-section/our-service-section';
import {TeamSection} from './team-section/team-section';
import {ContactSection} from './contact-section/contact-section';
import {Footer} from './footer/footer';
import {ReviewsSection} from './reviews-section/reviews-section';
import {BookNowSection} from './book-now-section/book-now-section';

@Component({
  selector: 'app-home-page',
  imports: [
    NavBar,
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
export class HomePage {

}
