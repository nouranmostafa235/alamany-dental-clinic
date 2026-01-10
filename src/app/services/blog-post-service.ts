import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogPostService {
  constructor(private http: HttpClient) { }
  baseApiUrl: string = 'https://alamanyclinic.obl.ee/api/v1/';
  getAll(): Observable<any> {
    return this.http.get(this.baseApiUrl+'blogs')
  }
  createBlogPost(blogPost:any):Observable<any>{
    return this.http.post(this.baseApiUrl+'blogs', blogPost)
  }
  deleteBlogPosts(id:number):Observable<any>{
    return this.http.delete(this.baseApiUrl+'blogs/'+id)
  }
}
