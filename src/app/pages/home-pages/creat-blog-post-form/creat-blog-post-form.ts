import { Component } from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import { TagInputModule } from 'ngx-chips';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-creat-blog-post-form',
  imports: [
    MatDialogTitle,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    TagInputModule,
    FormsModule
  ],
  templateUrl: './creat-blog-post-form.html',
  styleUrl: './creat-blog-post-form.css',
})
export class CreatBlogPostForm {
  items = [];
  public onSelect(item:any) {
    console.log('tag selected: value is ' + item);
  }
}
