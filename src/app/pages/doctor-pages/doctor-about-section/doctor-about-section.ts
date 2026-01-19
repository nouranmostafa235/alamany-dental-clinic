import { Component } from '@angular/core';
import {DoctorReview} from '../doctor-review/doctor-review';

@Component({
  selector: 'app-doctor-about-section',
  imports: [
    DoctorReview
  ],
  templateUrl: './doctor-about-section.html',
  styleUrl: './doctor-about-section.css',
})
export class DoctorAboutSection {

}
