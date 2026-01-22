import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppointmentService} from '../appointment-service/appointment-service';
import {AppointmentStepperService} from '../../../services/appointment-stepper-service';

@Component({
  selector: 'app-appointment-type',
  imports: [],
  templateUrl: './appointment-type.html',
  styleUrl: './appointment-type.css',
})
export class AppointmentType {
  step: number = 1;
  constructor(private router: Router, private route: ActivatedRoute, private appointmentService: AppointmentStepperService) {
  }
  ngOnInit() {
    const url = Number( this.router.url.split('/')[2]);
    this.step = url
    this.appointmentService.setStep(url)
  }
  next(action: string) {
    this.appointmentService.next(action,this.step+1);
    this.router.navigate(['book-appointment/2']);
  }

  // back() {
  //   this.appointmentService.back();
  //   this.router.navigate(['../step-1'], { relativeTo: this.route });
  // }

}
