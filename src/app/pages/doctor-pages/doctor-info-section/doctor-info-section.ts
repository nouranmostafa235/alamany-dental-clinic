import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DoctorsService} from '../../../services/doctors-service';
import {RouterLink} from '@angular/router';
import {CreateServiceForm} from '../../admin-pages/create-service-form/create-service-form';
import {MatDialog} from '@angular/material/dialog';
import {CreateDoctorReview} from '../create-doctor-review/create-doctor-review';

@Component({
  selector: 'app-doctor-info-section',
  imports: [
    RouterLink
  ],
  templateUrl: './doctor-info-section.html',
  styleUrl: './doctor-info-section.css',
})
export class DoctorInfoSection implements OnInit {
  doctorData: any = null;
 constructor(private doctorService: DoctorsService,
             private dialog: MatDialog,
             private cdr: ChangeDetectorRef) {
 }

 ngOnInit() {
   this.doctorService.doctor$.subscribe(doctor => {
     this.doctorData = doctor;
     this.cdr.detectChanges();
   })
 }
  openDialog(doctor:any) {
    const dialogRef = this.dialog.open(CreateDoctorReview, {
      width: '800px',
      data: {
        doctor: doctor
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.doctorService.doctor$.subscribe(doctor => {
          this.doctorData = doctor;
          this.cdr.detectChanges();
        })
      }
    });
  }
}
