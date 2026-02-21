import {Component, inject} from '@angular/core';
import {DoctorsService} from '../../../services/doctors-service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-doctor-office-hour-section',
  imports: [
    AsyncPipe
  ],
  templateUrl: './doctor-office-hour-section.html',
  styleUrl: './doctor-office-hour-section.css',
})
export class DoctorOfficeHourSection {
  private doctorService = inject(DoctorsService);
  doctorData$ = this.doctorService.doctor$;
}
