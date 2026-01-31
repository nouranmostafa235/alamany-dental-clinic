import {Component, OnInit} from '@angular/core';
import {AppointmentStepperService} from '../../../services/appointment-stepper-service';

@Component({
  selector: 'app-booking-form',
  imports: [],
  templateUrl: './booking-form.html',
  styleUrl: './booking-form.css',
})
export class BookingForm implements OnInit {
  serviceName = '';
  serviceDuration = '';
  time = '';
  doctorName = '';

  constructor(private service: AppointmentStepperService) {

  }


  ngOnInit() {
    this.serviceName = this.service.getAppointmentService()?.split(',')[0]
    this.serviceDuration = this.service.getAppointmentService()?.split(',')[1]
    this.time = this.service.getAppointmentTime()
    this.doctorName = this.service.getDoctor()
  }
}
