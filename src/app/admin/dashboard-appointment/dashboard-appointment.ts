import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

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

}
