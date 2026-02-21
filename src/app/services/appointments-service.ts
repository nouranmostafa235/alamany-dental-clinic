import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  baseApiUrl = environment.apiBaseUrl+'appointments/';
  private http = inject(HttpClient)
  getAllAppointments(): Observable<any> {
    return this.http.get(`${this.baseApiUrl}`)
  }
  getAllDoctors(): Observable<any> {
    return this.http.get(`${this.baseApiUrl}doctors/list`)
  }
  getDoctorOfficeHours(id:any): Observable<any>{
    return this.http.get(`${this.baseApiUrl}doctors/${id}/office-hours`)
  }
}
