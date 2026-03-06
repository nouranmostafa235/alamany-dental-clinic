import {Component, Inject, inject} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TagInputModule } from 'ngx-chips';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogPostEnum } from '../../../enums/blog-post-enum';
import { BlogPostService } from '../../../services/blog-post-service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

interface MediaFile {
  file: File;
  preview: string;
  safePreview?: SafeUrl;
}

@Component({
  selector: 'app-creat-blog-post-form',
  imports: [
    TagInputModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './creat-blog-post-form.html',
  styleUrl: './creat-blog-post-form.css',
})
export class CreatBlogPostForm {
  items: string[] = [];
  blogPostService = inject(BlogPostService);
  categoryList = Object.values(BlogPostEnum);

  coverFile: File | null = null;
  coverPreview: string | null = null;
  // Additional images (max 10)
  imageFiles: MediaFile[] = [];

  // Videos (max 5)
  videoFiles: MediaFile[] = [];
  isEditMode = false;
  createBlogPostForm: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<CreatBlogPostForm>,
              @Inject(MAT_DIALOG_DATA) public data: any,private toaster: ToastrService,
              private sanitizer: DomSanitizer) {
    this.createBlogPostForm = this.fb.group({
      title:      new FormControl('', [Validators.required]),
      content:    new FormControl('', [Validators.required]),
      summary:    new FormControl('', [Validators.required]),
      tags:       new FormControl<string[]>([], [Validators.required]),
      category:   new FormControl('', [Validators.required]),
      coverImage: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit() {
    if (this.data?.mode === 'edit') {
      this.isEditMode = true;
      const post = this.data.service;

      this.createBlogPostForm.patchValue({
        title:      post.title,
        content:    post.content,
        summary:    post.summary,
        tags:       post.tags,
        category:   post.category,
        coverImage: post.coverImage ?? null,
      });

      this.items = post.tags ?? [];

      if (post.coverImage) {
        this.coverPreview = post.coverImage;
      }

      if (post.images?.length) {
        this.imageFiles = post.images.map((url: string) => ({
          file: null as any,
          preview: url
        }));
      }

      if (post.videos?.length) {
        this.videoFiles = post.videos.map((url: string) => ({
          file: null as any,
          preview: url,
          safePreview: this.sanitizer.bypassSecurityTrustUrl(url)
        }));
      }
    }
  }
  /* ─── Tags ────────────────────────────────────────────── */
  onTagChange() {
    this.createBlogPostForm.get('tags')?.setValue(this.items);
  }


  onCoverSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    this.coverFile = file;
    this.coverPreview = URL.createObjectURL(file);

    this.createBlogPostForm.get('coverImage')?.setValue(file);
  }
  removeCover() {
    if (this.coverPreview) {
      URL.revokeObjectURL(this.coverPreview);
    }

    this.coverPreview = null;
    this.coverFile = null;
    this.createBlogPostForm.get('coverImage')?.setValue(null);
  }
  /* ─── Additional images ───────────────────────────────── */
  onImagesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    this.addImages(Array.from(input.files));
    input.value = ''; // reset so same file can be re-selected
  }

  onImagesDrop(event: DragEvent) {
    event.preventDefault();
    const files = Array.from(event.dataTransfer?.files ?? []).filter(f => f.type.startsWith('image/'));
    this.addImages(files);
  }

  private addImages(files: File[]) {
    const remaining = 10 - this.imageFiles.length;
    files.slice(0, remaining).forEach(file => {
      const preview = URL.createObjectURL(file);
      this.imageFiles.push({ file, preview });
    });
  }

  // removeImage(index: number) {
  //   URL.revokeObjectURL(this.imageFiles[index].preview);
  //   this.imageFiles.splice(index, 1);
  // }

  /* ─── Videos ──────────────────────────────────────────── */
  onVideosSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    this.addVideos(Array.from(input.files));
    input.value = '';
  }

  onVideosDrop(event: DragEvent) {
    event.preventDefault();
    const files = Array.from(event.dataTransfer?.files ?? []).filter(f => f.type.startsWith('video/'));
    this.addVideos(files);
  }

  private addVideos(files: File[]) {
    const remaining = 5 - this.videoFiles.length;
    files.slice(0, remaining).forEach(file => {
      const preview = URL.createObjectURL(file);
      const safePreview = this.sanitizer.bypassSecurityTrustUrl(preview);
      this.videoFiles.push({ file, preview,safePreview });
    });
  }

  // removeVideo(index: number) {
  //   URL.revokeObjectURL(this.videoFiles[index].preview);
  //   this.videoFiles.splice(index, 1);
  // }

  removeVideo(index: number) {
    const removed = this.videoFiles[index];
    if (removed.file !== null) {
      URL.revokeObjectURL(removed.preview);
    }
    this.videoFiles.splice(index, 1);
  }

  removeImage(index: number) {
    const removed = this.imageFiles[index];
    if (removed.file !== null) {
      URL.revokeObjectURL(removed.preview);
    }
    this.imageFiles.splice(index, 1);
  }
  /* ─── Submit ──────────────────────────────────────────── */
  createBlog() {
    const formData = this.buildFormData();
    if(this.isEditMode){
      this.blogPostService.updateBlogPost(this.data.service._id,formData).subscribe({
        next: () => {
          this.toaster.success('Blog updated successfully!', 'Success');
          this.dialogRef.close(true)
        },
        error: () => this.dialogRef.close(true),
      });
    }
    else {
      this.blogPostService.createBlogPost(formData).subscribe({
        next: () => {
          this.toaster.success('Blog added successfully!', 'Success');
          this.dialogRef.close(true)
        },
        error: () => this.dialogRef.close(true),
      });
    }

  }

  buildFormData(): FormData {
    const formData = new FormData();
    const { title, content, summary, category, tags } = this.createBlogPostForm.value;

    formData.append('title', title);
    formData.append('content', content);
    formData.append('summary', summary);
    formData.append('category', category);
    (tags as string[]).forEach(tag => formData.append('tags', tag));

    // Only append if a new file was selected
    if (this.coverFile) {
      formData.append('coverImage', this.coverFile);
    }

    // Only append new image files (skip null/server ones)
    this.imageFiles.forEach(({ file, preview }) => {
      if (file !== null) {
        formData.append('images', file);
      } else {
        formData.append('images', preview);
      }
    });

    this.videoFiles.forEach(({ file, preview }) => {
      if (file !== null) {
        formData.append('videos', file);
      } else {
        formData.append('videos', preview);
      }
    });

    return formData;
  }
  /* ─── Cleanup object URLs on destroy ─────────────────── */
  ngOnDestroy() {
    if (this.coverPreview) {
      URL.revokeObjectURL(this.coverPreview);
    }
    this.imageFiles.forEach(f => URL.revokeObjectURL(f.preview));
    this.videoFiles.forEach(f => URL.revokeObjectURL(f.preview));
  }
}
