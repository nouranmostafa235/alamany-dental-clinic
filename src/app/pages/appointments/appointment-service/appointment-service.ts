import {ChangeDetectorRef, Component} from '@angular/core';
import {AppointmentStepperService} from '../../../services/appointment-stepper-service';
import {Router} from '@angular/router';
import {OurServicesService} from '../../../services/our-services-service';

@Component({
  selector: 'app-appointment-service',
  imports: [],
  templateUrl: './appointment-service.html',
  styleUrl: './appointment-service.css',
})
export class AppointmentService {
  services:any
  currentUrl: number=2
  constructor(
    private stepper: AppointmentStepperService,
    private router: Router,
    private service: OurServicesService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.service.getServices().subscribe({
      next: (next: any) => {
        this.services = next.data.services;
        this.cdr.detectChanges();
      }
    })
    const url =Number( this.router.url.split('/')[2]);
    this.currentUrl = url;
    this.stepper.setStep(url)
  }
  nextStep(serviceName: string) {
    this.stepper.next(serviceName,this.currentUrl+1)
    this.router.navigate(['book-appointment/3']);
  }
}
