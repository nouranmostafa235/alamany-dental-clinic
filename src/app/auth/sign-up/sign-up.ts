import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-sign-up',
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  showPassword = false;
  showPasswordConfirm = false;
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  togglePassConfirmed() {
    this.showPasswordConfirm = !this.showPasswordConfirm
  }
}
