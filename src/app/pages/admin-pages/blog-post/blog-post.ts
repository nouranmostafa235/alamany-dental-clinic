import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {BlogPostModal} from '../blog-post-modal/blog-post-modal';
import {AuthService} from '../../../services/auth-service';
import {BlogPostService} from '../../../services/blog-post-service';
import {MatDialog} from '@angular/material/dialog';
import {CreateServiceForm} from '../create-service-form/create-service-form';
import {CreatBlogPostForm} from '../../home-pages/creat-blog-post-form/creat-blog-post-form';

@Component({
  selector: 'app-blog-post',
  imports: [CommonModule],
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.css',
})
export class BlogPost implements OnInit{
  currentRoute: string = ''
  blogPost: any[]=[];
  constructor(private router: Router,
              private blogService:BlogPostService,
              private cdr: ChangeDetectorRef,
              private dialog: MatDialog) {
  }

 ngOnInit(){

   this.currentRoute = this.router.url.split('/')[2];
   this.loadBlogPosts()
 }
 loadBlogPosts(){
   this.blogService.getAll().subscribe({
     next: (data: any) => {
       this.blogPost = data.data.blogs;
       this.cdr.detectChanges();
     }
   })
 }
  openForm() {
    const dialogRef = this.dialog.open(CreatBlogPostForm, {});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBlogPosts();
      }
    });
  }
  openModal(blogPost: any)
  {
    this.dialog.open(BlogPostModal, {
      data : {blogPost: blogPost},
      width: '900px',
    })
  }
  deleteBlogPost(id:any){
    this.blogService.deleteBlogPosts(id).subscribe({
      next: (data: any) => {
        this.cdr.detectChanges();
      }
    })
  }
}
