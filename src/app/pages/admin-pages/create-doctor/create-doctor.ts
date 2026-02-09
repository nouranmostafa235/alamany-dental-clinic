import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatDialogActions, MatDialogClose, MatDialogTitle} from '@angular/material/dialog';
import {DoctorsService} from '../../../services/doctors-service';

@Component({
  selector: 'app-create-doctor',
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    ReactiveFormsModule
  ],
  templateUrl: './create-doctor.html',
  styleUrl: './create-doctor.css',
})
export class CreateDoctor {
  doctorService = inject(DoctorsService);
 createDoctorForm: FormGroup = new FormGroup({
   firstName: new FormControl('', [Validators.required]),
   lastName: new FormControl('', [Validators.required]),
   email: new FormControl('', [Validators.required]),
   specialization: new FormControl('', [Validators.required]),
   licenseNumber: new FormControl('DDS-1439856', [Validators.required]),
   bio: new FormControl('', [Validators.required]),
   picture: new FormControl(),
 })
  createDoctor(form: any) {
   this.doctorService.createDoctor(form.value).subscribe({
     next: data => {
       console.log(data);
     }
   })
  }
}
