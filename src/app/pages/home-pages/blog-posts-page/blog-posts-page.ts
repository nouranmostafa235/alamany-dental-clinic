import {Component, OnInit} from '@angular/core';
import {NavBar} from '../../nav-bar/nav-bar';
import {Router} from '@angular/router';
import {BlogPost} from '../../admin-pages/blog-post/blog-post';
import {Footer} from '../../../shared-components/footer/footer';
import {MatDialog} from '@angular/material/dialog';
import {CreatBlogPostForm} from '../creat-blog-post-form/creat-blog-post-form';
import {BlogPostService} from '../../../services/blog-post-service';

@Component({
  selector: 'app-blog-posts-page',
  imports: [
    NavBar,
    BlogPost,
    Footer
  ],
  templateUrl: './blog-posts-page.html',
  styleUrl: './blog-posts-page.css',
})
export class BlogPostsPage implements OnInit {
  latestBlogSrc = ''
  constructor(private router: Router , private dialog : MatDialog, private blogPostService : BlogPostService) {
  }

  ngOnInit() {
    this.blogPostService.getAll().subscribe( {
      next:(data)=>{
        const latestBlog = [...data.data.blogs].sort((a, b) =>
          new Date (b.createdAt).getTime() - new Date (a.createdAt).getTime()
        )[0];
        this.latestBlogSrc = `url(${latestBlog.coverImage})`;
      }
    })
  }

  activeTag: string = 'all';
  openModal(){
    this.dialog.open(CreatBlogPostForm,{
      width:'1200px',
      maxHeight:'90vh'
    })
  }
  setActive(newTag: string) {
    this.activeTag = newTag;
  }
}
