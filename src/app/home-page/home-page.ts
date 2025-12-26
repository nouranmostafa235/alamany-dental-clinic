import { Component } from '@angular/core';
import {NavBar} from '../nav-bar/nav-bar';
import {HomeSection} from './home-section/home-section';
import {CounterSection} from './counter-section/counter-section';
import {AboutSection} from './about-section/about-section';
import {OurServiceSection} from './our-service-section/our-service-section';
import {TeamSection} from './team-section/team-section';
import {ContactSection} from './contact-section/contact-section';
import {Footer} from './footer/footer';

@Component({
  selector: 'app-home-page',
  imports: [
    NavBar,
    HomeSection,
    CounterSection,
    AboutSection,
    OurServiceSection,
    TeamSection,
    ContactSection,
    Footer
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {

}
