import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth-service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private route = inject(ActivatedRoute);
  loginForm: FormGroup = new FormGroup({
    email : new FormControl('', Validators.required),
    password : new FormControl('', Validators.required),
  });
  showPassword = false;
  constructor(private auth: AuthService, private router: Router) {
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  login(form:any) {
    this.auth.login(form.value).subscribe({
      next: (res) => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
        this.router.navigate([returnUrl]);
      }
    })
  }
  // loginGmail(){
  //   this.auth.loginGmail().subscribe({
  //     next: (value) => {
  //       console.log(value);
  //     }
  //   })
  // }
}
