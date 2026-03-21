import {LoadingService} from './loading-service';
import {LoadingScreen} from '../shared-components/loading-screen/loading-screen';
import {Injectable, effect, inject, PLATFORM_ID} from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import {isPlatformBrowser} from '@angular/common';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
@Injectable({ providedIn: 'root' })
export class LoadingOverlayService {
  private dialog = inject(MatDialog);
  private loading = inject(LoadingService);
  private platformId = inject(PLATFORM_ID);
  private dialogRef: MatDialogRef<LoadingScreen> | null = null;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      effect(() => {
        this.loading.isLoading() ? this.attach() : this.detach();
      });
    }
  }

  private attach() {
    if (this.dialogRef) return;
    this.dialogRef = this.dialog.open(LoadingScreen, {
      panelClass: 'loading-panel',
      backdropClass: 'loading-backdrop-blur',
      disableClose: true,
      hasBackdrop: true,
    });
  }

  private detach() {
    this.dialogRef?.close();
    this.dialogRef = null;
  }
}
