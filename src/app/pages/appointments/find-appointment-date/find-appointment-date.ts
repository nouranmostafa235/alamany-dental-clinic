import { Component } from '@angular/core';
import {AppointmentStepperService} from '../../../services/appointment-stepper-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-find-appointment-date',
  imports: [],
  templateUrl: './find-appointment-date.html',
  styleUrl: './find-appointment-date.css',
})
export class FindAppointmentDate {
  serviceName: string|undefined = '';
  serviceDuration: string|undefined = '';
  doctorName: string|undefined = '';
  doctorImage: string|undefined = '';
  constructor(private service: AppointmentStepperService,private router: Router) {
  }
  ngOnInit() {
    this.serviceName = this.service.getAppointmentService()?.split(',')[0]
    this.serviceDuration = this.service.getAppointmentService()?.split(',')[1]
    this.doctorName = this.service.getDoctor()
    this.doctorImage = this.service.getDoctorImage()
  }
  stepBack(){
    const step = this.service.getStep()-1;
    this.router.navigate(['book-appointment/'+step]);
    this.service.back()
  }
  nextStep(){
    const step = this.service.getStep()+1;
    this.router.navigate(['book-appointment/'+step]);
    this.service.next("",step, false)
  }
}
