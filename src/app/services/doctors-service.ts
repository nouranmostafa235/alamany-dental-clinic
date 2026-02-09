import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DoctorsService {
  baseApiUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient) {}
  getAllDoctors(): Observable<any>{
    return this.http.get(this.baseApiUrl+'doctors')
  }
  getDoctorById(id:any):Observable<any>{
    return this.http.get(`${this.baseApiUrl}doctors/${id}`)
  }
  createDoctor(doctor:any):Observable<any>{
    return this.http.post(`${this.baseApiUrl}doctors`, doctor)
  }
}
