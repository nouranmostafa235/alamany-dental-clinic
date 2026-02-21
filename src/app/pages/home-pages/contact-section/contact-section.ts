import {Component, AfterViewInit, PLATFORM_ID, Inject} from '@angular/core';
import {CarouselModule} from "ngx-owl-carousel-o";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {isPlatformBrowser} from '@angular/common';
import {MessagesService} from '../../../services/messages-service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
@Component({
  selector: 'app-contact-section',
  imports: [
    CarouselModule,
    ReactiveFormsModule
  ],
  templateUrl: './contact-section.html',
  styleUrl: './contact-section.css',
})
export class ContactSection implements AfterViewInit {
  messageForm: FormGroup= new FormGroup({
    name : new FormControl('',[Validators.required]),
    email : new FormControl('',[Validators.required]),
    phone : new FormControl('',[Validators.required]),
    message : new FormControl('',[Validators.required]),
  });
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private messageService :MessagesService,
              private toaster: ToastrService) {}
  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.gsap-contact', {
      scrollTrigger: {
        trigger: '.gsap-contact',
        start: 'top 70%',
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });
  }
  createMessage(form: FormGroup) {
   this.messageService.addMessage(form.value).subscribe({
     next: (data) => {
       this.toaster.success('Message sent successfully!', 'Success');
       form.reset();
     },
     error: (error) => {
       this.toaster.error('Failed to send message. Please try again.', 'Error');
     }
   })
  }
}
