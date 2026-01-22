import { Component } from '@angular/core';
import {DoctorInfoSection} from '../doctor-info-section/doctor-info-section';
import {Footer} from '../../../shared-components/footer/footer';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
@Component({
  selector: 'app-doctor-profile',
  imports: [
    DoctorInfoSection,
    Footer,
    RouterLink,
    RouterOutlet,
    RouterLinkActive
  ],
  templateUrl: './doctor-profile.html',
  styleUrl: './doctor-profile.css',
})
export class DoctorProfile {
}
