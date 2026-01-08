import { Component } from '@angular/core';
import {PreviewModal} from '../preview-modal/preview-modal';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, FormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [FormsModule, MatDialogModule],
  templateUrl: './patient-form.html',
  styleUrl: './patient-form.css',
})
export class PatientForm {
  form: FormGroup = new FormGroup({
    fullName : new FormControl('',Validators.required),
    nationalId: new FormControl('',Validators.required),
  });
  constructor(private dialog: MatDialog,
              private fb: FormBuilder,) {
  }

  preventInvalidKeys(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }

  fixNegative(event: any) {
    if (event.target.value < 0) {
      event.target.value = 0;
    }
  }
  openPreview() {
    this.dialog.open(PreviewModal, {
      width: '700px',
      data: this.form.value,
      disableClose: true,
    });

  }
}
