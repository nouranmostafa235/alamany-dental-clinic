import {Component, inject} from '@angular/core';
import {AppointmentsService} from '../../../services/appointments-service';
import {BehaviorSubject, map, switchMap} from 'rxjs';
import {AsyncPipe, DatePipe} from '@angular/common';
import {FilterPipe} from '../../../pipes/filter-pipe';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-cancelled-appointment',
  imports: [
    AsyncPipe,
    DatePipe,
    FilterPipe,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './cancelled-appointment.html',
  styleUrl: './cancelled-appointment.css',
})
export class CancelledAppointment {
  searchTerm = ''
 appointService = inject(AppointmentsService);
  private refresh$ = new BehaviorSubject<void>(undefined);
  allCancelledAppointments$ = this.refresh$.pipe(
    switchMap(() => this.appointService.getAllAppointments()),
    map(res => res.data.filter((app: any) => app.status === 'cancelled'))
  );
}
