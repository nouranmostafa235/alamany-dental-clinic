import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AppointmentStepperService} from '../../../services/appointment-stepper-service';
import {Router} from '@angular/router';
import {OurServicesService} from '../../../services/our-services-service';

@Component({
  selector: 'app-appointment-doctor',
  imports: [],
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
    console.log(this.currentUrl);
    this.stepper.setStep(url)
  }
  nextStep() {
    console.log("au")
    this.stepper.setStep(this.currentUrl+1)
    this.router.navigate(['book-appointment/5']);
  }
}
