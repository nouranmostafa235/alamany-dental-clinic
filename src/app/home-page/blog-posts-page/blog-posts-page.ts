import {Component, OnInit} from '@angular/core';
import {NavBar} from '../../nav-bar/nav-bar';
import {Router} from '@angular/router';
import {BlogPost} from '../../admin/blog-post/blog-post';
import {Footer} from '../footer/footer';

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
  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  activeTag: string = 'all';
  setActive(newTag: string) {
    this.activeTag = newTag;
  }
}
