import {Component, inject, PLATFORM_ID} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {AppointmentsService} from '../../../services/appointments-service';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-dashboard-appointment',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './dashboard-appointment.html',
  styleUrl: './dashboard-appointment.css',
})
export class DashboardAppointment {
 allAppointments:any=[]
  private platformId = inject(PLATFORM_ID);
  constructor(private appointmentService: AppointmentsService) {
    if(!isPlatformBrowser(this.platformId)){
      return;
    }
  }
  ngOnInit() {
   this.appointmentService.getAllAppointments().subscribe(appointments => {
     this.allAppointments = appointments.data;
     this.appointmentService.setAppointmentData(this.allAppointments);
   })
  }
}
