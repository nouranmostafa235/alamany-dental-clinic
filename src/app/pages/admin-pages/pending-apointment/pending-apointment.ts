import {Component, inject} from '@angular/core';
import {AppointmentsService} from '../../../services/appointments-service';
import {BehaviorSubject, map, switchMap} from 'rxjs';
import {AsyncPipe, DatePipe} from '@angular/common';
import {ConfirmationDialog} from '../../../shared-components/confirmation-dialog/confirmation-dialog';
import {MatDialog} from '@angular/material/dialog';
import {FilterPipe} from '../../../pipes/filter-pipe';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-pending-apointment',
  imports: [
    AsyncPipe,
    DatePipe,
    FilterPipe,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './pending-apointment.html',
  styleUrl: './pending-apointment.css',
})
export class PendingApointment {
  private dialog = inject(MatDialog)
  searchTerm: string = ''
  appointService = inject(AppointmentsService);
  private refresh$ = new BehaviorSubject<void>(undefined);
  allPendingAppointments$ = this.refresh$.pipe(
    switchMap(() => this.appointService.getAllAppointments()),
    map(res => res.data.filter((app: any) => app.status === 'pending'))
  );
  updateStatus(id: number, appointStatus: string) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '400px',
      data: { message: appointStatus==='cancelled'? 'Are you sure you want to cancel this appointment?' :
          'Are you sure you want to confirm this appointment?', status: appointStatus },
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.appointService.updateStatus(id, appointStatus).subscribe(() => {
          this.refresh$.next();
        });
      }
    });

  }
}
