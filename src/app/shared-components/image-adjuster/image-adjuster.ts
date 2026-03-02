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
export interface CroppedResult {
  blob: Blob;
  base64: string;
  file: File;
}
@Component({
  selector: 'app-image-adjuster',
  imports: [
    DecimalPipe
  ],
  templateUrl: './image-adjuster.html',
  styleUrl: './image-adjuster.css',
})

export class ImageAdjuster {
  @Input() aspectRatio: number = 1;
  @Input() outputWidth: number = 400;
  @Input() outputHeight: number = 400;
  @Input() outputFormat: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg';
  @Input() quality: number = 0.92;
  @Input() maxFileSizeMB: number = 5;

  @Output() imageCropped = new EventEmitter<ImageAdjusterResult>();
  @Output() cancelled = new EventEmitter<void>();

  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;

  private readonly platformId = inject(PLATFORM_ID);

  imageSrc = signal<string | null>(null);
  isDragging = signal(false);
  isProcessing = signal(false);
  error = signal<string | null>(null);

  scale = signal(1);
  offsetX = signal(0);
  offsetY = signal(0);

  private img: HTMLImageElement | null = null;
  private originalFile: File | null = null;   // ← keep reference to raw file
  private originalBase64: string | null = null; // ← keep reference to raw base64
  isDraggingImg = false;
  private lastX = 0;
  private lastY = 0;
  minScale = 1;

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

  onDragOver(event: DragEvent): void { event.preventDefault(); this.isDragging.set(true); }
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

    // Store the original File object for API upload
    this.originalFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;

      // Store original base64 for original preview
      this.originalBase64 = src;

      this.imageSrc.set(src);
      this.loadImageToCanvas(src);
    };
    reader.readAsDataURL(file);
  }

  private loadImageToCanvas(src: string): void {
    const img = new Image();
    img.onload = () => {
      this.img = img;
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
    const x = (this.outputWidth - scaledW) / 2 + this.offsetX();
    const y = (this.outputHeight - scaledH) / 2 + this.offsetY();

    ctx.drawImage(this.img, x, y, scaledW, scaledH);
  }

  // ── Zoom ─────────────────────────────────────────────────────
  onWheel(event: WheelEvent): void {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.05 : 0.05;
    this.scale.set(Math.max(this.minScale, Math.min(4, this.scale() + delta)));
    this.clampOffset();
    this.drawCanvas();
  }

  zoomIn(): void { this.scale.set(Math.min(4, this.scale() + 0.1)); this.clampOffset(); this.drawCanvas(); }
  zoomOut(): void { this.scale.set(Math.max(this.minScale, this.scale() - 0.1)); this.clampOffset(); this.drawCanvas(); }
  resetZoom(): void { this.scale.set(this.minScale); this.offsetX.set(0); this.offsetY.set(0); this.drawCanvas(); }

  // ── Pan ───────────────────────────────────────────────────────
  onMouseDown(event: MouseEvent): void { this.isDraggingImg = true; this.lastX = event.clientX; this.lastY = event.clientY; }
  onMouseMove(event: MouseEvent): void {
    if (!this.isDraggingImg) return;
    this.offsetX.set(this.offsetX() + event.clientX - this.lastX);
    this.offsetY.set(this.offsetY() + event.clientY - this.lastY);
    this.lastX = event.clientX; this.lastY = event.clientY;
    this.clampOffset(); this.drawCanvas();
  }
  onMouseUp(): void { this.isDraggingImg = false; }

  private lastTouchDist = 0;
  onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 1) { this.isDraggingImg = true; this.lastX = event.touches[0].clientX; this.lastY = event.touches[0].clientY; }
    else if (event.touches.length === 2) { this.lastTouchDist = this.getTouchDist(event); }
  }
  onTouchMove(event: TouchEvent): void {
    event.preventDefault();
    if (event.touches.length === 1 && this.isDraggingImg) {
      this.offsetX.set(this.offsetX() + event.touches[0].clientX - this.lastX);
      this.offsetY.set(this.offsetY() + event.touches[0].clientY - this.lastY);
      this.lastX = event.touches[0].clientX; this.lastY = event.touches[0].clientY;
      this.clampOffset(); this.drawCanvas();
    } else if (event.touches.length === 2) {
      const dist = this.getTouchDist(event);
      this.scale.set(Math.max(this.minScale, Math.min(4, this.scale() + (dist - this.lastTouchDist) * 0.005)));
      this.lastTouchDist = dist; this.clampOffset(); this.drawCanvas();
    }
  }
  onTouchEnd(): void { this.isDraggingImg = false; }
  private getTouchDist(e: TouchEvent): number {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  clampOffset(): void {
    if (!this.img) return;
    const maxX = Math.max(0, (this.img.naturalWidth * this.scale() - this.outputWidth) / 2);
    const maxY = Math.max(0, (this.img.naturalHeight * this.scale() - this.outputHeight) / 2);
    this.offsetX.set(Math.max(-maxX, Math.min(maxX, this.offsetX())));
    this.offsetY.set(Math.max(-maxY, Math.min(maxY, this.offsetY())));
  }

  // ── Confirm — emit all 3 formats ────────────────────────────
  async confirm(): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !this.originalFile || !this.originalBase64) return;
    this.isProcessing.set(true);

    const canvas = this.canvasRef.nativeElement;

    canvas.toBlob(
      (croppedBlob) => {
        if (!croppedBlob) { this.isProcessing.set(false); return; }

        const croppedBase64 = canvas.toDataURL(this.outputFormat, this.quality);

        this.imageCropped.emit({
          originalFile: this.originalFile!,     // → send to API via FormData
          croppedBase64,                         // → use as <img [src]> for cropped preview
          croppedBlob,                           // → available if needed as Blob
          originalBase64: this.originalBase64!,  // → use as <img [src]> for original preview
        });

        this.isProcessing.set(false);
      },
      this.outputFormat,
      this.quality
    );
  }

  cancel(): void {
    this.imageSrc.set(null);
    this.img = null;
    this.originalFile = null;
    this.originalBase64 = null;
    this.cancelled.emit();
  }
}
