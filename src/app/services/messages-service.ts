import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  baseUrl = environment.apiBaseUrl+'messages/';
  private http = inject(HttpClient);

  addMessage(message: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, message)
  }
  getMessages(): Observable<any> {
    return this.http.get(`${this.baseUrl}`)
  }
  deleteMessage(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}${id}`)
  }
}
