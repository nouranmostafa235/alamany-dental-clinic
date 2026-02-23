import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  baseApiUrl = environment.apiBaseUrl+'appointments/';
  private http = inject(HttpClient)
  appointmentsData= new BehaviorSubject<any>(null);
  appointment$ = this.appointmentsData.asObservable();
  getAllAppointments(): Observable<any> {
    return this.http.get(`${this.baseApiUrl}`)
  }
  getAllDoctors(): Observable<any> {
    return this.http.get(`${this.baseApiUrl}doctors/list`)
  }
  getDoctorOfficeHours(id:any): Observable<any>{
    return this.http.get(`${this.baseApiUrl}doctors/${id}/office-hours`)
  }
  createAppointment(appointment: any): Observable<any> {
    return this.http.post(`${this.baseApiUrl}`, appointment)
  }
  setAppointmentData(data:any){
    this.appointmentsData.next(data);
  }
}
