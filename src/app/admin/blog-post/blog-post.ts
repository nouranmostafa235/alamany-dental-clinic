import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {BlogPostModal} from '../blog-post-modal/blog-post-modal';
import {AuthService} from '../../services/auth-service';
import {BlogPostService} from '../../services/blog-post-service';

@Component({
  selector: 'app-blog-post',
  imports: [CommonModule, BlogPostModal],
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.css',
})
export class BlogPost implements OnInit{
  currentRoute: string = ''
  blogPost: any[]=[];
  constructor(private router: Router, private blogService:BlogPostService) {
  }

 ngOnInit(){
   this.currentRoute = this.router.url.split('/')[2];
   this.blogService.getAll().subscribe({
     next: (data: any) => {
       this.blogPost = data.data.blogs;
       console.log(this.blogPost);
     }
   })
 }

}
