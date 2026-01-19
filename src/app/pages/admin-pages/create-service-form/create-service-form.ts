import { Component } from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatDialogActions, MatDialogClose, MatDialogTitle} from '@angular/material/dialog';
import {TagInputModule} from 'ngx-chips';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {OurServicesService} from '../../../services/our-services-service';

@Component({
  selector: 'app-create-service-form',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    TagInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-service-form.html',
  styleUrl: './create-service-form.css',
})
export class CreateServiceForm {
  constructor(private service:OurServicesService) {
  }
createForm: FormGroup = new FormGroup({
  name : new FormControl,
  description : new FormControl,
  category : new FormControl,
  minPrice : new FormControl,
  maxPrice : new FormControl,
});
createService(form:any){
  this.service.createService(form.value).subscribe({
    next: data => {
      console.log(data);
    }
  })
}
}
