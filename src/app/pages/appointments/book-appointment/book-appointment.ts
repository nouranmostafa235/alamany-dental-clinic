import {Component, Inject, PLATFORM_ID} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {fromEvent, Subscription} from 'rxjs';
import {AppointmentStepperService} from '../../../services/appointment-stepper-service';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-book-appointment',
  imports: [
    RouterOutlet
  ],
  templateUrl: './book-appointment.html',
  styleUrl: './book-appointment.css',
})
export class BookAppointment {
  private popStateSub!: Subscription;
  private isBrowser!: boolean;
  constructor(
    private wizard: AppointmentStepperService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  ngOnInit() {
    if (!this.isBrowser) return;
    this.popStateSub = fromEvent(window, 'popstate').subscribe(() => {
      this.onBackBrowser();
    });
  }

  ngOnDestroy() {
    this.popStateSub?.unsubscribe();
  }
  private onBackBrowser() {
    console.log('Back Browser');
    if (this.wizard.getStep() > 1) {
      this.wizard.back();
    }
  }
}
