import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BlogPostService {
  constructor(private http: HttpClient) { }
  baseApiUrl = environment.apiBaseUrl;
  getAll(): Observable<any> {
    return this.http.get(this.baseApiUrl+'blogs')
  }
  createBlogPost(blogPost:any):Observable<any>{
    return this.http.post(this.baseApiUrl+'blogs', blogPost)
  }
  updateBlogPost(id:any,blogPost:any):Observable<any>{
    return this.http.put(this.baseApiUrl+`blogs/${id}`, blogPost)
  }
  deleteBlogPosts(id:any):Observable<any>{
    return this.http.delete(this.baseApiUrl+'blogs/'+id)
  }
  getAllTags():Observable<any>{
    return this.http.get(this.baseApiUrl+'blogs/tags')
  }
}
