import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth-service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-verify-email',
  imports: [],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmail implements OnInit{
  token: any;
constructor(private authService: AuthService ,
            private route: ActivatedRoute , private router: Router) {
}
  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');
    })
  }

  verifyEmail(){
  this.authService.verifyEmail(this.token).subscribe({
    next: result => {
      console.log(result);
      if(result.success){
        this.router.navigate(['/']);

      }
    }
  });
  }
}
