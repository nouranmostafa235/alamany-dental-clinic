import {Component, inject, OnInit, PLATFORM_ID} from '@angular/core';
import {DoctorsService} from '../../../services/doctors-service';
import {AppointmentsService} from '../../../services/appointments-service';
import {BlogPostService} from '../../../services/blog-post-service';
import {AsyncPipe, DatePipe, isPlatformBrowser} from '@angular/common';
import {BehaviorSubject, map, of, switchMap} from 'rxjs';
import {FilterPipe} from '../../../pipes/filter-pipe';
import {FormsModule} from '@angular/forms';
import {ConfirmationDialog} from '../../../shared-components/confirmation-dialog/confirmation-dialog';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard-home',
  imports: [
    AsyncPipe,
    DatePipe,
    FilterPipe,
    FormsModule
  ],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.css',
})
export class DashboardHome implements OnInit {
  searchTerm = ''
  today = new Date();
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private doctorService = inject(DoctorsService)
  private appointService = inject(AppointmentsService)
  private blogPostService = inject(BlogPostService)
  private refresh$ = new BehaviorSubject<void>(undefined);
  totalDoctors$ = this.isBrowser
    ? this.doctorService.getAllDoctors()
    : of({ data: [] });

  totalAppointments$ = this.isBrowser
    ? this.appointService.getAllAppointments()
    : of({ data: [] });

  totalBlogPosts$ = this.isBrowser
    ? this.blogPostService.getAll()
    : of({ data: [] });

  allAppointments$ = this.isBrowser
    ? this.refresh$.pipe(
      switchMap(() => this.appointService.getAllAppointments()),
      map(res => res.data.filter((app: any) => app.status === 'pending'))
    )
    : of([]);
  private dialog = inject(MatDialog)
  ngOnInit() {

  }
  updateStatus(id: number, status: string) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '400px',
      data: { message: status==='cancelled'? 'Are you sure you want to cancel this appointment?' :
          'Are you sure you want to confirm this appointment?', status: status },
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.appointService.updateStatus(id, status).subscribe(() => {
          this.refresh$.next();
        });
      }
    });

  }
}
