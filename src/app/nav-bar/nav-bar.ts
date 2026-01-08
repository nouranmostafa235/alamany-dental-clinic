import {Component, HostListener, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  imports: [
    RouterLink,
    CommonModule,
  ],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar implements OnInit {
  constructor(private router: Router) {
  }
  ngOnInit() {
    this.url=this.router.url.split('/')[1]
  }
  activeSection: string = 'home';
  url:string='';
  sections = ['home', 'about', 'services','blog', 'team', 'contact'];

  scrollTo(sectionId: string) {
    this.activeSection = sectionId;

    const element = document.getElementById(sectionId);
    const navbarHeight =
      document.querySelector('.navbar')?.clientHeight || 0;

    if (element) {
      const position =
        element.getBoundingClientRect().top + window.pageYOffset;

      window.scrollTo({
        top: position - navbarHeight,
        behavior: 'smooth',
      });
    }
  }

  // 👇 Scroll Spy
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition =
      window.pageYOffset +
      (document.querySelector('.navbar')?.clientHeight || 0) +
      10;

    for (const section of this.sections) {
      const element = document.getElementById(section);
      if (!element) continue;

      const offsetTop = element.offsetTop;
      const offsetHeight = element.offsetHeight;

      if (
        scrollPosition >= offsetTop &&
        scrollPosition < offsetTop + offsetHeight
      ) {
        this.activeSection = section;
        break;
      }
    }
  }

}
