import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DoctorReview} from '../doctor-review/doctor-review';
import {DoctorsService} from '../../../services/doctors-service';

@Component({
  selector: 'app-doctor-about-section',
  imports: [],
  templateUrl: './doctor-about-section.html',
  styleUrl: './doctor-about-section.css',
})
export class DoctorAboutSection implements OnInit {
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
