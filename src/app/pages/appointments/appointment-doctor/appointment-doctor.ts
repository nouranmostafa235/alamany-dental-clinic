import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AppointmentStepperService} from '../../../services/appointment-stepper-service';
import {Router, RouterLink} from '@angular/router';
import {OurServicesService} from '../../../services/our-services-service';

@Component({
  selector: 'app-appointment-doctor',
  imports: [
    RouterLink
  ],
  templateUrl: './appointment-doctor.html',
  styleUrl: './appointment-doctor.css',
})
export class AppointmentDoctor implements OnInit {
  currentUrl: number=3
  constructor(
    private stepper: AppointmentStepperService,
    private router: Router,
  ) {}
  ngOnInit() {
    const url =Number( this.router.url.split('/')[2]);
    this.currentUrl = url;
    this.stepper.setStep(url)
  }
  nextStep(doctor: string, doctorImage: string) {
    this.stepper.setStep(this.currentUrl+1)
    this.stepper.setDoctor(doctor)
    this.stepper.setDoctorImage(doctorImage)
    this.router.navigate(['book-appointment/3']);
  }
}
