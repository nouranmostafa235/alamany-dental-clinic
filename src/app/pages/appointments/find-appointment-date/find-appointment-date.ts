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
  constructor(private service: AppointmentStepperService,private router: Router) {
  }
  ngOnInit() {
    this.serviceName = this.service.getAction()?.split(',')[0]
    this.serviceDuration = this.service.getAction()?.split(',')[1]
  }
  stepBack(){
    const step = this.service.getStep()-1;
    this.router.navigate(['book-appointment/'+step]);
    this.service.back()
  }
  nextStep(){
    const step = this.service.getStep()+1;
    this.router.navigate(['book-appointment/'+step]);
    this.service.next("findDate",step)
  }
}
