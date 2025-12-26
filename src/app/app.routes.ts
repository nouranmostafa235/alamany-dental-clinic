import { Routes } from '@angular/router';
import {HomePage} from './home-page/home-page';
import {BookAppointment} from './book-appointment/book-appointment/book-appointment';
import {Login} from './auth/login/login';
import {SignUp} from './auth/sign-up/sign-up';
import {DoctorProfile} from './doctors/doctor-profile/doctor-profile';

export const routes: Routes = [
  {path:'home', component:HomePage},
  {path:'' , redirectTo:'home',pathMatch:'full'},
  {path:'book-appointment' , component:BookAppointment},
  {path:'login', component:Login},
  {path:'sign-up', component:SignUp},
  {path:'doctor-profile', component:DoctorProfile}
];
