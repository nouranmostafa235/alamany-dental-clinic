import { Component } from '@angular/core';
import {NavBar} from '../../nav-bar/nav-bar';
import {DoctorInfoSection} from '../doctor-info-section/doctor-info-section';
import {DoctorCertificates} from '../doctor-certificates/doctor-certificates';
import {DoctorMaterial} from '../doctor-material/doctor-material';
import {DoctorOfficeHourSection} from '../doctor-office-hour-section/doctor-office-hour-section';
import {Footer} from '../../../shared-components/footer/footer';
import {DoctorReview} from '../doctor-review/doctor-review';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {CreatBlogPostForm} from '../../home-pages/creat-blog-post-form/creat-blog-post-form';

@Component({
  selector: 'app-doctor-profile',
  imports: [
    NavBar,
    DoctorInfoSection,
    DoctorCertificates,
    DoctorMaterial,
    DoctorOfficeHourSection,
    Footer,
    DoctorReview,
    RouterLink,
    RouterOutlet,
    RouterLinkActive
  ],
  templateUrl: './doctor-profile.html',
  styleUrl: './doctor-profile.css',
})
export class DoctorProfile {
}
