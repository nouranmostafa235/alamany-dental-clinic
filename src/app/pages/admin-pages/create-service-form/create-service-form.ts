import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TagInputModule} from 'ngx-chips';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {OurServicesService} from '../../../services/our-services-service';
import {ServiceEnum} from '../../../enums/service-enum';

@Component({
  selector: 'app-create-service-form',
  imports: [
    TagInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-service-form.html',
  styleUrl: './create-service-form.css',
})
export class CreateServiceForm implements OnInit {
  createForm: FormGroup
  serviceList = Object.values(ServiceEnum);
  isEditMode = false;
  constructor(private service:OurServicesService, private fb:FormBuilder,
              private dialogRef: MatDialogRef<CreateServiceForm>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.createForm = this.fb.group({
      name : ['', [Validators.required]],
      description : ['', [Validators.required]],
      category : [''],
      coverImage:[null],
      price: this.fb.group({
        min: [''],
        max: [''],
        currency:['']
      })
    });
  }

  ngOnInit() {
    if (this.data?.mode === 'edit') {
      this.isEditMode = true;
      this.createForm.patchValue(this.data.service);
    }
  }
  createService(form: FormGroup) {

    const formData = new FormData();

    formData.append('name', form.value.name);
    formData.append('description', form.value.description);
    formData.append('category', form.value.category);

    if (form.value.coverImage) {
      formData.append('coverImage', form.value.coverImage);
    }

    formData.append('price[min]', form.value.price.min);
    formData.append('price[max]', form.value.price.max);
    formData.append('price[currency]', form.value.price.currency || 'USD');

    if(this.data?.mode === 'edit'){
      this.service.updateService(this.data.service._id,formData).subscribe({
        next: data => this.dialogRef.close(true),
        error: data => this.dialogRef.close(true),
      })
    }
    else {
      this.service.createService(formData).subscribe({
        next: data => this.dialogRef.close(true),
        error: data => this.dialogRef.close(true),
      });
    }


  }
  onImageChange(event:any){
    const file = event.target.files[0];
    if (file) {
      this.createForm.patchValue({
        coverImage: file
      });
    }
    this.createForm.get('coverImage')?.updateValueAndValidity();
}
}
