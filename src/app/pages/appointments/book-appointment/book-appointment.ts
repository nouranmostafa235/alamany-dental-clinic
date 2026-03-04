import {Component, inject, Inject, PLATFORM_ID} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {fromEvent, Subscription} from 'rxjs';
import {AppointmentStepperService} from '../../../services/appointment-stepper-service';
import {isPlatformBrowser,Location} from '@angular/common';

@Component({
  selector: 'app-book-appointment',
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './book-appointment.html',
  styleUrl: './book-appointment.css',
})
export class BookAppointment {
  private popStateSub!: Subscription;
  private isBrowser!: boolean;
  private location = inject(Location)
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
    if (this.wizard.getStep() > 1) {
      this.wizard.back();
    }
  }
  goBack(){
    this.location.back();
  }
}
