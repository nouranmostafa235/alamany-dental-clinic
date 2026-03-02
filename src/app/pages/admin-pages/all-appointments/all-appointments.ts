import {ChangeDetectorRef, Component, inject, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {AppointmentsService} from '../../../services/appointments-service';
import {AsyncPipe, DatePipe, isPlatformBrowser} from '@angular/common';
import {DoctorsService} from '../../../services/doctors-service';
import {FilterPipe} from '../../../pipes/filter-pipe';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-all-appointments',
  imports: [
    AsyncPipe,
    DatePipe,
    FilterPipe,
    FormsModule
  ],
  templateUrl: './all-appointments.html',
  styleUrl: './all-appointments.css',
})
export class AllAppointments implements OnInit {
  searchTerm: string = '';
   service = inject(AppointmentsService);
  allAppointmentsList = this.service.appointment$
 constructor(private cdr: ChangeDetectorRef,
             @Inject(PLATFORM_ID) private platformId: Object ) {

 }
  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
  }


}
