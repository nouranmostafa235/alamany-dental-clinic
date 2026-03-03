import {Component, inject, signal} from '@angular/core';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import { TagInputModule } from 'ngx-chips';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ServiceEnum} from '../../../enums/service-enum';
import {BlogPostEnum} from '../../../enums/blog-post-enum';
import {CropResult, ImageAdjuster} from '../../../shared-components/image-adjuster/image-adjuster';
import {BlogPostService} from '../../../services/blog-post-service';

@Component({
  selector: 'app-creat-blog-post-form',
  imports: [
    TagInputModule,
    FormsModule,
    ImageAdjuster,
    ReactiveFormsModule
  ],
  templateUrl: './creat-blog-post-form.html',
  styleUrl: './creat-blog-post-form.css',
})
export class CreatBlogPostForm {
  items = [];

  blogPostService = inject(BlogPostService);
 categoryList = Object.values(BlogPostEnum);
  avatarPreviewUrl = signal<string | null>(null);
  cropResult = signal<CropResult | null>(null);
  showImageAdjuster = signal(false);
  createBlogPostForm: FormGroup;
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<CreatBlogPostForm>) {
    this.createBlogPostForm = this.fb.group({
      title: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required]),
      summary: new FormControl('', [Validators.required]),
      tags: new FormControl<string[]>([], [Validators.required]),
      category: new FormControl('', [Validators.required]),
      coverImage: new FormControl(null, [Validators.required]),
    })
  }
  onTagChange() {
    this.createBlogPostForm.get('tags')?.setValue(this.items);
  }
  createBlog() {

    const formData = this.buildFormData();

    this.blogPostService.createBlogPost(formData).subscribe({
      next: res => this.dialogRef.close(true),
      error: err => this.dialogRef.close(true),
    });

  }
  buildFormData(): FormData {
    const formData = new FormData();
    const title = this.createBlogPostForm.value.title;
    const content = this.createBlogPostForm.value.content;
    const summary = this.createBlogPostForm.value.summary;
    const category = this.createBlogPostForm.value.category;
    const tags = this.createBlogPostForm.value.tags
    const coverImage = this.createBlogPostForm.value.coverImage
    formData.append('title', title);
    formData.append('content', content);
    formData.append('summary', summary);
    (tags as string[]).forEach((tag: string) => {
      formData.append('tags', tag);
    });
    formData.append('category', category);
    if(coverImage){
      formData.append('coverImage', coverImage);
    }
    return formData;
  }
  onImageCropped(result: CropResult) {
    this.cropResult.set(result);
    this.avatarPreviewUrl.set(result.croppedPreviewUrl);
    this.createBlogPostForm
      .get('coverImage')
      ?.setValue(result.originalFile);
  }
}
