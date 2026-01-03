import { Component } from '@angular/core';
import {NavBar} from '../nav-bar/nav-bar';
import {HomeSection} from './home-section/home-section';
import {CounterSection} from './counter-section/counter-section';
import {AboutSection} from './about-section/about-section';
import {OurServiceSection} from './our-service-section/our-service-section';
import {TeamSection} from './team-section/team-section';
import {ContactSection} from './contact-section/contact-section';
import {Footer} from './footer/footer';
import {BlogPost} from '../admin/blog-post/blog-post';

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
    Footer,
    BlogPost
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {

}
