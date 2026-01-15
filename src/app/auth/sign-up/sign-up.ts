import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth-service';

@Component({
  selector: 'app-sign-up',
  imports: [
    RouterLink,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  showPassword = false;
  showPasswordConfirm = false;
  signUpForm: FormGroup = new FormGroup({
    firstName : new FormControl('', Validators.required),
    lastName : new FormControl('', Validators.required),
    email : new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    phone : new FormControl('', Validators.required),
  });
  constructor(private authService: AuthService , private router: Router) {
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  togglePassConfirmed() {
    this.showPasswordConfirm = !this.showPasswordConfirm
  }
  submitForm(form:any){
    this.authService.signUp(form.value).subscribe({
      next: (value) => {
        if (value.success == true) {
          this.router.navigate(['/verify-email']);
        }
      }
    });
  }
}
