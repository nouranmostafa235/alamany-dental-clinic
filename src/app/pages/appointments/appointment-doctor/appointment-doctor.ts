import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AppointmentStepperService} from '../../../services/appointment-stepper-service';
import {Router, RouterLink} from '@angular/router';
import {OurServicesService} from '../../../services/our-services-service';
import {AppointmentService} from '../appointment-service/appointment-service';
import {AppointmentsService} from '../../../services/appointments-service';


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
  allDoctors: any
  constructor(
    private stepper: AppointmentStepperService,
    private router: Router,
    private appointmentService: AppointmentsService,
    private cdr : ChangeDetectorRef
  ) {}
  ngOnInit() {
    const url =Number( this.router.url.split('/')[2]);
    this.currentUrl = url;
    this.stepper.setStep(url)
    this.getDoctors()
  }
  nextStep(doctor: string, doctorImage: string , doctorId: string) {
    this.stepper.setStep(this.currentUrl+1)
    this.stepper.setDoctor(doctor)
    this.stepper.setDoctorImage(doctorImage)
    this.stepper.setDoctorId(doctorId)
    this.router.navigate(['book-appointment/3']);
  }
  getDoctors(): void {
    this.appointmentService.getAllDoctors().subscribe({
      next: result => {
        this.allDoctors = result.data
        this.cdr.detectChanges()
      }
    })
  }
}
