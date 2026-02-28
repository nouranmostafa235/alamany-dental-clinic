import {Component, EventEmitter, Inject, Input, OnInit, Output, signal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DoctorsService} from '../../../services/doctors-service';
@Component({
  selector: 'app-create-doctor-review',
  imports: [
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-doctor-review.html',
  styleUrl: './create-doctor-review.css',
})
export class CreateDoctorReview implements OnInit {
  doctorData:any;
  reviewForm: FormGroup = new FormGroup({
    comment: new FormControl(''),
  });
 constructor( private dialogRef: MatDialogRef<CreateDoctorReview>,
             @Inject(MAT_DIALOG_DATA) public data: any, private doctorService: DoctorsService) {
}
ngOnInit() {
   this.doctorData = this.data.doctor
}
  @Input() label = '';
  @Output() ratingChange = new EventEmitter<any>();

  stars = [1, 2, 3, 4, 5];
  hoverRating = signal(0);
  selectedRating = signal(0);

  selectRating(value: number) {
    this.selectedRating.set(value);
    this.ratingChange.emit(value);
  }

  getLabel(): string {
    const labels: Record<number, string> = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good!',
      5: 'Excellent!'
    };
    return labels[this.selectedRating()] ?? '';
  }
  createReview() {
   const request= {
     rating: this.selectedRating(),
     comment: this.reviewForm.get('comment')?.value,
     doctorId: this.doctorData?._id
   }
   this.doctorService.createReview(request).subscribe({
     next: (res) => {
       this.doctorService.setDoctorData(this.doctorData);
       this.dialogRef.close(true)
     },
     error: err => {
       this.dialogRef.close(true)
     }
   })
  }
}
