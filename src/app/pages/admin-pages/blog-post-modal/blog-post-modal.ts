import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-blog-post-modal',
  imports: [
    MatDialogActions,
    MatButton,
    MatDialogClose,
    DatePipe,
    MatDialogContent,
    MatDialogTitle
  ],
  templateUrl: './blog-post-modal.html',
  styleUrl: './blog-post-modal.css',
})
export class BlogPostModal {
constructor( @Inject(MAT_DIALOG_DATA) public data: any) {
  console.log(data);
}

}
