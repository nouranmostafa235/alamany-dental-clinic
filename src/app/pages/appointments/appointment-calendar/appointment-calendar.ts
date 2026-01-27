import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import {AppointmentStepperService} from '../../../services/appointment-stepper-service';
import {Router} from '@angular/router';

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
  constructor(private appointmentService: AppointmentStepperService, private router: Router) {
  }
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
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
    this.fetchEnabledDays();
  }

  fetchEnabledDays() {
    this.loading.set(true);

    const date = this.currentDate();
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

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
    this.fetchEnabledDays();
  }
  isDayEnabled(day: number | null): boolean {
    return day !== null && this.enabledDays().includes(day);
  }
  handleDayClick(day: number | null) {

    if (this.isDayEnabled(day)) {
      this.selectedDay.set(day);
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
    this.appointmentService.setAppointmentTime(this.currentMonth()+' '+this.selectedDay()+','+this.currentYear()+' at '+ time);
    this.router.navigate(['book-appointment/6']);
  }
}
