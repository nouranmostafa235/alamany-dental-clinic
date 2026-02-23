import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  convertToISO(dateString: string, hour: number = 10): string {
    const formatted = dateString.replace(',', ', ');

    const date = new Date(formatted);

    const utcDate = new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hour, 0, 0, 0
    ));

    return utcDate.toISOString();
  }
}
