import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OurServicesService {
  baseApiUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient) {
  }

  getServices(): Observable<any> {
    return this.http.get(this.baseApiUrl+'services')
  }
  createService(service:any): Observable<any> {
    return this.http.post(this.baseApiUrl+'services', service)
  }
  deleteService(id: any): Observable<any> {
    return this.http.delete(this.baseApiUrl+'services/'+id);
  }
  updateService(id:any, data:any):Observable<any> {
    return this.http.put(this.baseApiUrl+`services/${id}`, data)
  }
}
