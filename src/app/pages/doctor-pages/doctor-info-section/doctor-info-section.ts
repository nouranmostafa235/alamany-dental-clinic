import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DoctorsService} from '../../../services/doctors-service';
import {RouterLink} from '@angular/router';

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
 constructor(private doctorService: DoctorsService, private cdr: ChangeDetectorRef) {
 }

 ngOnInit() {
   this.doctorService.doctor$.subscribe(doctor => {
     this.doctorData = doctor;
     this.cdr.detectChanges();
   })
 }
}
