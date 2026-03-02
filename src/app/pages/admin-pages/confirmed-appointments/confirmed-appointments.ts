import {Component, inject} from '@angular/core';
import {AppointmentsService} from '../../../services/appointments-service';
import {BehaviorSubject, map, switchMap} from 'rxjs';
import {AsyncPipe, DatePipe} from '@angular/common';
import {FilterPipe} from '../../../pipes/filter-pipe';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-confirmed-appointments',
  imports: [
    AsyncPipe,
    DatePipe,
    FilterPipe,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './confirmed-appointments.html',
  styleUrl: './confirmed-appointments.css',
})
export class ConfirmedAppointments {
  searchTerm: string = '';
  private appointService = inject(AppointmentsService)
  private refresh$ = new BehaviorSubject<void>(undefined);
  allConfirmedAppointments$ = this.refresh$.pipe(
    switchMap(() => this.appointService.getAllAppointments()),
    map(res => res.data.filter((app: any) => app.status === 'confirmed'))
  );
}
