import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DoctorsService {
  baseApiUrl = environment.apiBaseUrl;
  doctorData= new BehaviorSubject<any>(null);
  doctor$ = this.doctorData.asObservable();
  constructor(private http: HttpClient,
              @Inject(PLATFORM_ID) private platformId: Object) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
  }
  getAllDoctors(): Observable<any>{
    return this.http.get(this.baseApiUrl+'doctors')
  }
  getDoctorById(id:any):Observable<any>{
    return this.http.get(`${this.baseApiUrl}doctors/${id}`)
  }
  createDoctor(doctor:any):Observable<any>{
    return this.http.post(`${this.baseApiUrl}doctors`, doctor)
  }
  setDoctorData(data:any){
    this.doctorData.next(data);
  }
  deleteDoctor(id:any):Observable<any>{
    return this.http.delete(`${this.baseApiUrl}doctors/${id}`)
  }
}
