import {ChangeDetectorRef, Component, inject, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {AppointmentsService} from '../../../services/appointments-service';
import {isPlatformBrowser} from '@angular/common';
import {DoctorsService} from '../../../services/doctors-service';

@Component({
  selector: 'app-all-appointments',
  imports: [],
  templateUrl: './all-appointments.html',
  styleUrl: './all-appointments.css',
})
export class AllAppointments implements OnInit {
  allAppointmentsList: any
   service = inject(AppointmentsService)
  appointmentData$ = this.service.appointment$;
 constructor(private cdr: ChangeDetectorRef,
             @Inject(PLATFORM_ID) private platformId: Object ) {

 }
  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.loadAllAppointments()
  }

  loadAllAppointments() {
   this.service.getAllAppointments().subscribe({
     next: data => {
       this.allAppointmentsList = data.data
       this.cdr.detectChanges();
     }
   })
  }
}
