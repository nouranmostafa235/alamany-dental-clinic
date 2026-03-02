import {ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CreateServiceForm} from '../create-service-form/create-service-form';
import {MatDialog} from '@angular/material/dialog';
import {CreateDoctor} from '../create-doctor/create-doctor';
import {DoctorsService} from '../../../services/doctors-service';
import {FilterPipe} from '../../../pipes/filter-pipe';
import {FormsModule} from '@angular/forms';
import {isPlatformBrowser} from '@angular/common';
import {ConfirmationDialog} from '../../../shared-components/confirmation-dialog/confirmation-dialog';
import {ImagesAdjust} from '../../../services/images-adjust';

@Component({
  selector: 'app-dashboard-doctors',
  imports: [
    RouterLink,
    FilterPipe,
    FormsModule
  ],
  templateUrl: './dashboard-doctors.html',
  styleUrl: './dashboard-doctors.css',
})
export class DashboardDoctors implements OnInit {
  allDoctors: any=[]
  searchTerm: string = ''
  private platformId = inject(PLATFORM_ID);
  images = inject(ImagesAdjust);
  constructor(private dialog: MatDialog,
              private doctorService : DoctorsService,
              private cdr: ChangeDetectorRef) {

  }

  ngOnInit() {
    if(isPlatformBrowser(this.platformId)) {
      this.getDoctors()
    }

  }
  openDialog() {
    this.dialog.open(CreateDoctor,{})
  }
  getDoctors() {
    this.doctorService.getAllDoctors().subscribe({
      next: data => {
        this.allDoctors = data.data;
        this.cdr.detectChanges()
      }
    })
  }
  deleteDoctor(id: number) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '400px',
      data: { message: 'Are you sure you want to delete this doctor?' , status:'delete' }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.doctorService.deleteDoctor(id).subscribe({
          next: () => this.getDoctors()
        });
      }
    });
  }
}
