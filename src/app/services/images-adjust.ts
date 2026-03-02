import {computed, Injectable, signal} from '@angular/core';
export interface DoctorImageState {
  originalFile: File | null;
  originalBase64: string | null;
  croppedBase64: string | null;
  croppedBlob: Blob | null;
}
@Injectable({
  providedIn: 'root',
})
export class ImagesAdjust {
  private state = signal<DoctorImageState>({
    originalFile:  null,
    originalBase64: null,
    croppedBase64: null,
    croppedBlob:   null,
  });
  originalFile   = computed(() => this.state().originalFile);
  originalBase64 = computed(() => this.state().originalBase64);
  croppedBase64  = computed(() => this.state().croppedBase64);
  croppedBlob    = computed(() => this.state().croppedBlob);
  hasImage       = computed(() => !!this.state().originalFile);

  setImages(data: Omit<DoctorImageState, never>): void {
    this.state.set(data);
  }
  clear(): void {
    this.state.set({
      originalFile: null,
      originalBase64: null,
      croppedBase64: null,
      croppedBlob: null,
    });
  }
}
