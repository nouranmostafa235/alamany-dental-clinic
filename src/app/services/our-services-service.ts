import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OurServicesService {
  baseApiUrl: string = 'https://alamanyclinic.obl.ee/api/v1/';
  constructor(private http: HttpClient) {
  }

  getServices(): Observable<any> {
    return this.http.get(this.baseApiUrl+'services')
  }

}
