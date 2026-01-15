import { Component } from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatChipGrid, MatChipInput, MatChipRow, MatChipsModule} from '@angular/material/chips';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TagInputModule } from 'ngx-chips';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-creat-blog-post-form',
  imports: [
    MatDialogTitle,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatFormField,
    MatChipGrid,
    MatChipRow,
    MatIcon,
    TagInputModule,
    MatChipInput,
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
