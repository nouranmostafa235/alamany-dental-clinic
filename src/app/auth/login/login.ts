import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth-service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup = new FormGroup({
    email : new FormControl('', Validators.required),
    password : new FormControl('', Validators.required),
  });
  showPassword = false;
  constructor(private auth: AuthService) {
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  login(form:any) {
    this.auth.login(form.value).subscribe({
      next: (value) => {

      }
    })
  }
}
