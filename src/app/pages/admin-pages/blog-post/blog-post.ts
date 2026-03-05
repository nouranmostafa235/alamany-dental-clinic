import {ChangeDetectorRef, Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {BlogPostModal} from '../blog-post-modal/blog-post-modal';
import {AuthService} from '../../../services/auth-service';
import {BlogPostService} from '../../../services/blog-post-service';
import {MatDialog} from '@angular/material/dialog';
import {CreateServiceForm} from '../create-service-form/create-service-form';
import {CreatBlogPostForm} from '../../home-pages/creat-blog-post-form/creat-blog-post-form';
import {ConfirmationDialog} from '../../../shared-components/confirmation-dialog/confirmation-dialog';
import {FormsModule} from '@angular/forms';
import {FilterPipe} from '../../../pipes/filter-pipe';

@Component({
  selector: 'app-blog-post',
  imports: [CommonModule, FormsModule, FilterPipe],
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.css',
})
export class BlogPost implements OnInit{
  @Input() filteredBlogs : any;
  currentRoute: string = ''
  blogPost: any[]=[];
  searchTerm: string = '';
  constructor(private router: Router,
              private blogService:BlogPostService,
              private cdr: ChangeDetectorRef,
              private dialog: MatDialog) {
  }

 ngOnInit(){
   this.currentRoute = this.router.url.split('/')[2];
   if(!this.filteredBlogs){
      this.loadBlogPosts()
   }

 }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['filteredBlogs']) {
      // console.log('Blogs updated:', this.filteredBlogs);
    }
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
    const dialogRef = this.dialog.open(CreatBlogPostForm, {
      width: '900px',
      maxWidth: '60vw',
      maxHeight:'90vh'
    });

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
    const dialogRef = this.dialog.open(ConfirmationDialog,{
      width: '400px',
      data: { message: 'Are you sure you want to delete this Blog?' , status: 'delete' }
    })
    dialogRef.afterClosed().subscribe((confirmed:any) => {
      if (confirmed) {
        this.blogService.deleteBlogPosts(id).subscribe({
          next: (data: any) => {
            this.loadBlogPosts();
          }
        })
      }
    });

  }
}
