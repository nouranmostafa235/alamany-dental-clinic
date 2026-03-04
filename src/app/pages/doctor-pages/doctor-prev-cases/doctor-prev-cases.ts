import {Component, inject} from '@angular/core';
import {DoctorsService} from '../../../services/doctors-service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-doctor-prev-cases',
  imports: [
    AsyncPipe
  ],
  templateUrl: './doctor-prev-cases.html',
  styleUrl: './doctor-prev-cases.css',
})
export class DoctorPrevCases {
  private doctorService = inject(DoctorsService);
  doctorData$ = this.doctorService.doctor$;
  activeImage: { url: string; label: string; caseTitle: string } | null = null;
  openLightbox(url: string, label: 'Before' | 'After', caseTitle: string): void {
    this.activeImage = { url, label, caseTitle };
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.activeImage = null;
    document.body.style.overflow = '';
  }
}
