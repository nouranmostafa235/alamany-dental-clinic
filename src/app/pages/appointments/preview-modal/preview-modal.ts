import {Component, Inject} from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
@Component({
  selector: 'app-preview-modal',
  imports: [MatDialogModule, MatButton],
  templateUrl: './preview-modal.html',
  styleUrl: './preview-modal.css',
})
export class PreviewModal {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }

}
