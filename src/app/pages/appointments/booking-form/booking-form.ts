import {Component, inject, OnInit, PLATFORM_ID} from '@angular/core';
import {AppointmentStepperService} from '../../../services/appointment-stepper-service';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {isPlatformBrowser} from '@angular/common';
import {AppointmentsService} from '../../../services/appointments-service';
import {DateService} from '../../../services/date-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-booking-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './booking-form.html',
  styleUrl: './booking-form.css',
})
export class BookingForm implements OnInit {
  serviceName = '';
  serviceDuration = '';
  time = '';
  doctorName = '';
  bookAppointmentForm: FormGroup = new FormGroup({
    firstName : new FormControl(),
    lastName: new FormControl(),
    month: new FormControl(''),
    day: new FormControl(),
    year: new FormControl(),
    phoneNumber: new FormControl(),
    gender: new FormControl(''),
    email: new FormControl(),
    appointmentDate: new FormControl(),
    notes: new FormControl('First visit, slight tooth pain'),
    doctorProfileId: new FormControl()
  });
  currentUrl: any
  months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
 private platformId = inject(PLATFORM_ID) ;
  constructor(private service: AppointmentStepperService ,
              private appointments: AppointmentsService,
              private dateService: DateService,
              private router: Router) {
    if(!isPlatformBrowser(this.platformId)) {
      return;
    }
  }
  ngOnInit() {
    const url =Number( this.router.url.split('/')[2]);
    this.currentUrl = url;
    this.service.setStep(url)
    this.serviceName = this.service.getAppointmentService()?.split(',')[0]
    this.serviceDuration = this.service.getAppointmentService()?.split(',')[1]
    this.time = this.service.getAppointmentTime()
    this.doctorName = this.service.getDoctor()
  }
  formatDateOfBirth(): string {
    const { month, day, year } = this.bookAppointmentForm.value;

    const monthIndex = this.months.indexOf(month);

    const date = new Date(Date.UTC(year, monthIndex, day));

    return date.toISOString().split('T')[0];
  }
  bookAppointmentFormSubmit(){
    const formattedDOB = this.formatDateOfBirth();

    const payload = {
      ...this.bookAppointmentForm.value,
      dateOfBirth: formattedDOB,
      doctorProfileId: this.service.getDoctorId(),
      appointmentDate: this.dateService.convertToISO(this.service.getAppointmentTime())
    };

    delete payload.month;
    delete payload.day;
    delete payload.year;
  this.appointments.createAppointment(payload).subscribe({
    next: (data) => {
      this.service.setStep(this.currentUrl+1)
      this.router.navigate([`/book-appointment/${this.currentUrl+1}`,data]);
    }
  })
  }
}
