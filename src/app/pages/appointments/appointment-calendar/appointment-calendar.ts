import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppointmentStepperService} from '../../../services/appointment-stepper-service';
import {Router} from '@angular/router';
import {AppointmentsService} from '../../../services/appointments-service';

interface CalendarDay {
  day: number | null;
  isCurrentMonth: boolean;
}
@Component({
  selector: 'app-appointment-calendar',
  imports: [CommonModule],
  templateUrl: './appointment-calendar.html',
  styleUrl: './appointment-calendar.css',
})
export class AppointmentCalendar implements OnInit {
  constructor(private appointmentService: AppointmentStepperService, private router: Router,
              private service : AppointmentsService) {
  }
  officeHours = signal<any[]>([]);

  dayNameToIndex: Record<string, number> = {
    'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
    'Thursday': 4, 'Friday': 5, 'Saturday': 6
  };
  currentDate = signal(new Date(2026, 0, 1));
  enabledDays = signal<number[]>([]);
  selectedDay = signal<number | null>(null);
  loading = signal(false);
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  days = computed(() => this.getDaysInMonth(this.currentDate()));
  currentMonth = computed(() => this.monthNames[this.currentDate().getMonth()]);
  currentYear = computed(() => this.currentDate().getFullYear());

  ngOnInit() {
    // this.fetchEnabledDays();
    this.getDoctorOfficeHours(this.appointmentService.getDoctorId())
  }

  fetchEnabledDays() {
    this.loading.set(true);

    // const date = this.currentDate();
    // const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    // Replace with your actual API endpoint
    // this.http.get<number[]>(`/api/calendar/enabled-days/${yearMonth}`)
    //   .subscribe({
    //     next: (days) => {
    //       this.enabledDays.set(days);
    //       this.loading.set(false);
    //     },
    //     error: () => {
    //       this.enabledDays.set([]);
    //       this.loading.set(false);
    //     }
    //   });
    this.enabledDays.set([1,2,4])
    this.loading.set(false);
  }
  getDaysInMonth(date: Date): CalendarDay[] {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: CalendarDay[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }

    return days;
  }
  navigateMonth(direction: number) {
    const newDate = new Date(
      this.currentDate().getFullYear(),
      this.currentDate().getMonth() + direction,
      1
    );
    this.currentDate.set(newDate);
    this.selectedDay.set(null);
    this.computeEnabledDays()
  }
  isDayEnabled(day: number | null): boolean {
    return day !== null && this.enabledDays().includes(day);
  }
  handleDayClick(day: number | null) {

    if (this.isDayEnabled(day)) {
      this.selectedDay.set(day);
      this.nextStep('')
    }
  }
  getDayClasses(item: CalendarDay): string {
    if (!item.isCurrentMonth) return '';

    const isEnabled = this.isDayEnabled(item.day);
    const isSelected = item.day === this.selectedDay();

    let classes = 'day-cell ';

    if (isEnabled) {
      classes += isSelected ? 'day-selected ' : 'day-enabled ';
    } else {
      classes += 'day-disabled ';
    }

    if (this.loading()) {
      classes += 'loading ';
    }

    return classes;
  }
  nextStep(time: any){
    const url =Number( this.router.url.split('/')[2]);
    this.appointmentService.setStep(url+1);
    this.appointmentService.setAppointmentTime(this.currentMonth()+' '+this.selectedDay()+','+this.currentYear());
    this.router.navigate(['book-appointment/5']);
  }
  getDoctorOfficeHours(id:any){
    this.service.getDoctorOfficeHours(id).subscribe({
      next: (next: any) => {
        this.officeHours.set(next.data.officeHours);
        this.computeEnabledDays();
      }
    })
  }
  computeEnabledDays() {
    const date = this.currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const enabledWeekdays = this.officeHours().map(
      oh => this.dayNameToIndex[oh.day]
    );

    const enabledDates: number[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const weekday = new Date(year, month, d).getDay();
      if (enabledWeekdays.includes(weekday)) {
        enabledDates.push(d);
      }
    }

    this.enabledDays.set(enabledDates);
    this.loading.set(false);
  }

}
