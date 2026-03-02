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
import {isPlatformBrowser} from '@angular/common';

export interface CroppedResult {
  blob: Blob;
  base64: string;
  file: File;
}
@Component({
  selector: 'app-image-adjuster',
  imports: [],
  templateUrl: './image-adjuster.html',
  styleUrl: './image-adjuster.css',
})

export class ImageAdjuster {
  @Input() aspectRatio: number = 1;          // 1 = square, 16/9, etc.
  @Input() outputWidth: number = 400;        // final image width in px
  @Input() outputHeight: number = 400;       // final image height in px
  @Input() outputFormat: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg';
  @Input() quality: number = 0.92;
  @Input() maxFileSizeMB: number = 5;

  @Output() imageCropped = new EventEmitter<CroppedResult>();
  @Output() cancelled = new EventEmitter<void>();

  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;

  private readonly platformId = inject(PLATFORM_ID);

  // State
  imageSrc = signal<string | null>(null);
  isDragging = signal(false);
  isProcessing = signal(false);
  error = signal<string | null>(null);

  // Pan & Zoom state
  scale = signal(1);
  offsetX = signal(0);
  offsetY = signal(0);

  private img: HTMLImageElement | null = null;
  protected isDraggingImg = false;
  private lastX = 0;
  private lastY = 0;
  protected minScale = 1;

  // ── File Input ──────────────────────────────────────────────
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.loadFile(file);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) this.loadFile(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(): void { this.isDragging.set(false); }

  private loadFile(file: File): void {
    this.error.set(null);

    if (!file.type.startsWith('image/')) {
      this.error.set('Please select a valid image file.');
      return;
    }
    if (file.size > this.maxFileSizeMB * 1024 * 1024) {
      this.error.set(`File size must be under ${this.maxFileSizeMB}MB.`);
      return;
    }

    if (!isPlatformBrowser(this.platformId)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      this.imageSrc.set(src);
      this.loadImageToCanvas(src);
    };
    reader.readAsDataURL(file);
  }

  private loadImageToCanvas(src: string): void {
    const img = new Image();
    img.onload = () => {
      this.img = img;

      // Calculate minimum scale to fill the crop area
      const scaleX = this.outputWidth / img.naturalWidth;
      const scaleY = this.outputHeight / img.naturalHeight;
      this.minScale = Math.max(scaleX, scaleY);

      this.scale.set(this.minScale);
      this.offsetX.set(0);
      this.offsetY.set(0);
      this.drawCanvas();
    };
    img.src = src;
  }

  // ── Canvas Drawing ───────────────────────────────────────────
  drawCanvas(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas || !this.img) return;

    const ctx = canvas.getContext('2d')!;
    canvas.width = this.outputWidth;
    canvas.height = this.outputHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scaledW = this.img.naturalWidth * this.scale();
    const scaledH = this.img.naturalHeight * this.scale();

    // Center the image + apply pan offset
    const x = (this.outputWidth - scaledW) / 2 + this.offsetX();
    const y = (this.outputHeight - scaledH) / 2 + this.offsetY();

    ctx.drawImage(this.img, x, y, scaledW, scaledH);
  }

  // ── Zoom ─────────────────────────────────────────────────────
  onWheel(event: WheelEvent): void {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.05 : 0.05;
    const newScale = Math.max(this.minScale, Math.min(4, this.scale() + delta));
    this.scale.set(newScale);
    this.clampOffset();
    this.drawCanvas();
  }

  zoomIn(): void {
    this.scale.set(Math.min(4, this.scale() + 0.1));
    this.clampOffset();
    this.drawCanvas();
  }

  zoomOut(): void {
    this.scale.set(Math.max(this.minScale, this.scale() - 0.1));
    this.clampOffset();
    this.drawCanvas();
  }

  resetZoom(): void {
    this.scale.set(this.minScale);
    this.offsetX.set(0);
    this.offsetY.set(0);
    this.drawCanvas();
  }

  // ── Pan (Mouse) ──────────────────────────────────────────────
  onMouseDown(event: MouseEvent): void {
    this.isDraggingImg = true;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDraggingImg) return;
    const dx = event.clientX - this.lastX;
    const dy = event.clientY - this.lastY;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
    this.offsetX.set(this.offsetX() + dx);
    this.offsetY.set(this.offsetY() + dy);
    this.clampOffset();
    this.drawCanvas();
  }

  onMouseUp(): void { this.isDraggingImg = false; }

  // ── Pan (Touch) ──────────────────────────────────────────────
  private lastTouchDist = 0;

  onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 1) {
      this.isDraggingImg = true;
      this.lastX = event.touches[0].clientX;
      this.lastY = event.touches[0].clientY;
    } else if (event.touches.length === 2) {
      this.lastTouchDist = this.getTouchDist(event);
    }
  }

  onTouchMove(event: TouchEvent): void {
    event.preventDefault();
    if (event.touches.length === 1 && this.isDraggingImg) {
      const dx = event.touches[0].clientX - this.lastX;
      const dy = event.touches[0].clientY - this.lastY;
      this.lastX = event.touches[0].clientX;
      this.lastY = event.touches[0].clientY;
      this.offsetX.set(this.offsetX() + dx);
      this.offsetY.set(this.offsetY() + dy);
      this.clampOffset();
      this.drawCanvas();
    } else if (event.touches.length === 2) {
      const dist = this.getTouchDist(event);
      const delta = (dist - this.lastTouchDist) * 0.005;
      const newScale = Math.max(this.minScale, Math.min(4, this.scale() + delta));
      this.scale.set(newScale);
      this.lastTouchDist = dist;
      this.clampOffset();
      this.drawCanvas();
    }
  }

  onTouchEnd(): void { this.isDraggingImg = false; }

  private getTouchDist(event: TouchEvent): number {
    const dx = event.touches[0].clientX - event.touches[1].clientX;
    const dy = event.touches[0].clientY - event.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // ── Clamp pan so image never leaves the crop area ────────────
  protected clampOffset(): void {
    if (!this.img) return;
    const scaledW = this.img.naturalWidth * this.scale();
    const scaledH = this.img.naturalHeight * this.scale();

    const maxX = Math.max(0, (scaledW - this.outputWidth) / 2);
    const maxY = Math.max(0, (scaledH - this.outputHeight) / 2);

    this.offsetX.set(Math.max(-maxX, Math.min(maxX, this.offsetX())));
    this.offsetY.set(Math.max(-maxY, Math.min(maxY, this.offsetY())));
  }

  // ── Export ───────────────────────────────────────────────────
  async confirm(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    this.isProcessing.set(true);

    const canvas = this.canvasRef.nativeElement;

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const base64 = canvas.toDataURL(this.outputFormat, this.quality);
        const file = new File([blob], `cropped.${this.outputFormat.split('/')[1]}`, {
          type: this.outputFormat
        });
        this.imageCropped.emit({ blob, base64, file });
        this.isProcessing.set(false);
      },
      this.outputFormat,
      this.quality
    );
  }

  cancel(): void {
    this.imageSrc.set(null);
    this.img = null;
    this.cancelled.emit();
  }
}
