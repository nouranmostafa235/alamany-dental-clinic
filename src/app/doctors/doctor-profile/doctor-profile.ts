import { Component } from '@angular/core';
import {NavBar} from '../../nav-bar/nav-bar';
import {DoctorInfoSection} from '../doctor-info-section/doctor-info-section';
import {DoctorCertificates} from '../doctor-certificates/doctor-certificates';
import {DoctorMaterial} from '../doctor-material/doctor-material';
import {DoctorOfficeHourSection} from '../doctor-office-hour-section/doctor-office-hour-section';
import {Footer} from '../../home-page/footer/footer';
import {DoctorReview} from '../doctor-review/doctor-review';

@Component({
  selector: 'app-doctor-profile',
  imports: [
    NavBar,
    DoctorInfoSection,
    DoctorCertificates,
    DoctorMaterial,
    DoctorOfficeHourSection,
    Footer,
    DoctorReview
  ],
  templateUrl: './doctor-profile.html',
  styleUrl: './doctor-profile.css',
})
export class DoctorProfile {

}
