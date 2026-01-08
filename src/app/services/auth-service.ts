import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseApiUrl: string = 'https://alamanyclinic.obl.ee/api/v1/';
  constructor(private http: HttpClient) {
  }
  signUp(signUpFrom:any): Observable<any>{
    return this.http.post(this.baseApiUrl+'auth/register', signUpFrom);
  }
}
