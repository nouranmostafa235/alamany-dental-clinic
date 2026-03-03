import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  PLATFORM_ID,
  signal,
  ViewChild
} from '@angular/core';
import {DecimalPipe, isPlatformBrowser} from '@angular/common';
export interface ImageAdjusterResult {
  // For API upload — the original untouched file
  originalFile: File;

  // For cropped preview display only (not sent to API)
  croppedBase64: string;
  croppedBlob: Blob;

  // For original preview display only
  originalBase64: string;
}
export type CropShape = 'circle' | 'square' | 'rect';
export interface CropResult {
  /** Original file as uploaded by user — send this to your API */
  originalFile: File;
  /** Cropped/adjusted blob — use this for display */
  croppedBlob: Blob;
  /** Object URL for immediate display (revoke when done) */
  croppedPreviewUrl: string;
}
@Component({
  selector: 'app-image-adjuster',
  imports: [

  ],
  templateUrl: './image-adjuster.html',
  styleUrl: './image-adjuster.css',
})

export class ImageAdjuster {
  @Input() shape: CropShape = 'circle';
  /** Canvas / frame size in px */
  @Input() frameSize = 320;
  /** Max upload size in MB */
  @Input() maxSizeMb = 5;
  @Input() confirmLabel = 'Apply';

  // ── Outputs ───────────────────────────────────────────────────────────────
  @Output() cropped = new EventEmitter<CropResult>();
  @Output() cancelled = new EventEmitter<void>();

  // ── View refs ─────────────────────────────────────────────────────────────
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  // ── State (signals) ───────────────────────────────────────────────────────
  imageSrc = signal<string | null>(null);
  scale = signal(1);
  rotation = signal(0);
  isDragOver = signal(false);
  isSaving = signal(false);
  errorMsg = signal('');

  // ── Internal ──────────────────────────────────────────────────────────────
  private img = new Image();
  private offsetX = 0;
  private offsetY = 0;
  private dragging = false;
  private lastX = 0;
  private lastY = 0;
  private originalFile: File | null = null;
  private isBrowser: boolean;

  constructor() {
    this.isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  }

  // ── File selection ────────────────────────────────────────────────────────
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.loadFile(input.files[0]);
  }

  onDragOver(e: DragEvent) {
    e.preventDefault();
    this.isDragOver.set(true);
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.isDragOver.set(false);
    const file = e.dataTransfer?.files[0];
    if (file) this.loadFile(file);
  }

  private loadFile(file: File) {
    if (!file.type.startsWith('image/')) {
      this.errorMsg.set('Please upload a valid image file.');
      return;
    }
    if (file.size > this.maxSizeMb * 1024 * 1024) {
      this.errorMsg.set(`File exceeds ${this.maxSizeMb} MB limit.`);
      return;
    }
    this.errorMsg.set('');
    this.originalFile = file;

    if (!this.isBrowser) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      this.img = new Image();
      this.img.onload = () => {
        this.resetTransform();
        this.imageSrc.set(src);
        // Draw after view updates
        setTimeout(() => this.draw(), 0);
      };
      this.img.src = src;
    };
    reader.readAsDataURL(file);
  }

  // ── Canvas drawing ────────────────────────────────────────────────────────
  draw() {
    if (!this.isBrowser) return;
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas || !this.img.width) return;

    const ctx = canvas.getContext('2d')!;
    const size = this.frameSize;
    ctx.clearRect(0, 0, size, size);

    ctx.save();
    ctx.translate(size / 2 + this.offsetX, size / 2 + this.offsetY);
    ctx.rotate((this.rotation() * Math.PI) / 180);
    ctx.scale(this.scale(), this.scale());

    const s = Math.min(size / this.img.width, size / this.img.height);
    const w = this.img.width * s;
    const h = this.img.height * s;
    ctx.drawImage(this.img, -w / 2, -h / 2, w, h);
    ctx.restore();
  }

  // ── Drag ──────────────────────────────────────────────────────────────────
  startDrag(e: MouseEvent) {
    this.dragging = true;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
  }
  onDrag(e: MouseEvent) {
    if (!this.dragging) return;
    this.offsetX += e.clientX - this.lastX;
    this.offsetY += e.clientY - this.lastY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.draw();
  }
  startTouchDrag(e: TouchEvent) {
    const t = e.touches[0];
    this.dragging = true;
    this.lastX = t.clientX;
    this.lastY = t.clientY;
  }
  onTouchDrag(e: TouchEvent) {
    e.preventDefault();
    if (!this.dragging) return;
    const t = e.touches[0];
    this.offsetX += t.clientX - this.lastX;
    this.offsetY += t.clientY - this.lastY;
    this.lastX = t.clientX;
    this.lastY = t.clientY;
    this.draw();
  }
  stopDrag() { this.dragging = false; }

  // ── Controls ──────────────────────────────────────────────────────────────
  onScaleChange(e: Event) {
    this.scale.set(parseFloat((e.target as HTMLInputElement).value));
    this.draw();
  }
  onRotationChange(e: Event) {
    this.rotation.set(parseInt((e.target as HTMLInputElement).value, 10));
    this.draw();
  }

  reset() { this.resetTransform(); this.draw(); }

  private resetTransform() {
    this.scale.set(1);
    this.rotation.set(0);
    this.offsetX = 0;
    this.offsetY = 0;
  }

  changeImage() {
    this.imageSrc.set(null);
    this.originalFile = null;
    if (this.fileInputRef) this.fileInputRef.nativeElement.value = '';
  }

  // ── Confirm / export ──────────────────────────────────────────────────────
  confirm() {
    if (!this.isBrowser || !this.originalFile) return;
    this.isSaving.set(true);

    const canvas = this.canvasRef.nativeElement;
    const outputCanvas = document.createElement('canvas');
    const size = this.frameSize;
    outputCanvas.width = size;
    outputCanvas.height = size;
    const ctx = outputCanvas.getContext('2d')!;

    // Clip to shape
    ctx.save();
    if (this.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 12, 0, Math.PI * 2);
      ctx.clip();
    } else if (this.shape === 'square') {
      ctx.beginPath();
      ctx.roundRect(12, 12, size - 24, size - 24, 8);
      ctx.clip();
    } else {
      ctx.beginPath();
      ctx.roundRect(24, 12, size - 48, size - 24, 8);
      ctx.clip();
    }

    ctx.drawImage(canvas, 0, 0);
    ctx.restore();

    outputCanvas.toBlob((blob) => {
      if (!blob) { this.isSaving.set(false); return; }
      const url = URL.createObjectURL(blob);
      this.cropped.emit({
        originalFile: this.originalFile!,
        croppedBlob: blob,
        croppedPreviewUrl: url,
      });
      this.isSaving.set(false);
    }, 'image/jpeg', 0.92);
  }

  ngOnDestroy() {
    // No persistent object URLs created until confirm() — caller is responsible for revoking
  }
}
