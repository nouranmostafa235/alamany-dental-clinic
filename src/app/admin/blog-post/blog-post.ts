import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {BlogPostModal} from '../blog-post-modal/blog-post-modal';

@Component({
  selector: 'app-blog-post',
  imports: [CommonModule, BlogPostModal],
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.css',
})
export class BlogPost implements OnInit{
  currentRoute: string = ''
  constructor(private router: Router, private route: ActivatedRoute) {
  }

 ngOnInit(){
   this.currentRoute = this.router.url.split('/')[2];

 }
}
