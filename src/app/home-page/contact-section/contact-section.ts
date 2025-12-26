import { Component } from '@angular/core';
import {CarouselModule} from "ngx-owl-carousel-o";

@Component({
  selector: 'app-contact-section',
    imports: [
        CarouselModule
    ],
  templateUrl: './contact-section.html',
  styleUrl: './contact-section.css',
})
export class ContactSection {

}
