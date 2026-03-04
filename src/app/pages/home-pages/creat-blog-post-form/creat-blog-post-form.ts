import { Component, inject, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TagInputModule } from 'ngx-chips';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogPostEnum } from '../../../enums/blog-post-enum';
import { CropResult, ImageAdjuster } from '../../../shared-components/image-adjuster/image-adjuster';
import { BlogPostService } from '../../../services/blog-post-service';

interface MediaFile {
  file: File;
  preview: string;
}

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
  items: string[] = [];

  blogPostService = inject(BlogPostService);
  categoryList = Object.values(BlogPostEnum);

  avatarPreviewUrl = signal<string | null>(null);
  cropResult = signal<CropResult | null>(null);

  // Additional images (max 10)
  imageFiles: MediaFile[] = [];

  // Videos (max 5)
  videoFiles: MediaFile[] = [];

  createBlogPostForm: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<CreatBlogPostForm>) {
    this.createBlogPostForm = this.fb.group({
      title:      new FormControl('', [Validators.required]),
      content:    new FormControl('', [Validators.required]),
      summary:    new FormControl('', [Validators.required]),
      tags:       new FormControl<string[]>([], [Validators.required]),
      category:   new FormControl('', [Validators.required]),
      coverImage: new FormControl(null, [Validators.required]),
    });
  }

  /* ─── Tags ────────────────────────────────────────────── */
  onTagChange() {
    this.createBlogPostForm.get('tags')?.setValue(this.items);
  }

  /* ─── Cover image (via ImageAdjuster) ─────────────────── */
  onImageCropped(result: CropResult) {
    this.cropResult.set(result);
    this.avatarPreviewUrl.set(result.croppedPreviewUrl);
    this.createBlogPostForm.get('coverImage')?.setValue(result.originalFile);
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

  removeImage(index: number) {
    URL.revokeObjectURL(this.imageFiles[index].preview);
    this.imageFiles.splice(index, 1);
  }

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
      this.videoFiles.push({ file, preview });
    });
  }

  removeVideo(index: number) {
    URL.revokeObjectURL(this.videoFiles[index].preview);
    this.videoFiles.splice(index, 1);
  }

  /* ─── Submit ──────────────────────────────────────────── */
  createBlog() {
    const formData = this.buildFormData();
    this.blogPostService.createBlogPost(formData).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.dialogRef.close(true),
    });
  }

  buildFormData(): FormData {
    const formData = new FormData();
    const { title, content, summary, category, tags, coverImage } = this.createBlogPostForm.value;

    formData.append('title', title);
    formData.append('content', content);
    formData.append('summary', summary);
    formData.append('category', category);

    // Tags as repeated fields (matches API expectation)
    (tags as string[]).forEach(tag => formData.append('tags', tag));

    // Cover image
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    // Additional images (field name: images, max 10)
    this.imageFiles.forEach(({ file }) => formData.append('images', file));

    // Videos (field name: videos, max 5)
    this.videoFiles.forEach(({ file }) => formData.append('videos', file));

    return formData;
  }

  /* ─── Cleanup object URLs on destroy ─────────────────── */
  ngOnDestroy() {
    this.imageFiles.forEach(f => URL.revokeObjectURL(f.preview));
    this.videoFiles.forEach(f => URL.revokeObjectURL(f.preview));
  }
}
