import { Routes } from '@angular/router';
import {HomePage} from './home-page/home-page';
import {BookAppointment} from './book-appointment/book-appointment/book-appointment';
import {Login} from './auth/login/login';
import {SignUp} from './auth/sign-up/sign-up';
import {DoctorProfile} from './doctors/doctor-profile/doctor-profile';
import {Dashboard} from './admin/dashboard/dashboard';
import {DashboardHome} from './admin/dashboard-home/dashboard-home';
import {DashboardDoctors} from './admin/dashboard-doctors/dashboard-doctors';
import {PatientDashboard} from './admin/patient-dashboard/patient-dashboard';
import {DashboardAppointment} from './admin/dashboard-appointment/dashboard-appointment';
import {AllAppointments} from './admin/all-appointments/all-appointments';
import {ConfirmedAppointments} from './admin/confirmed-appointments/confirmed-appointments';
import {CancelledAppointment} from './admin/cancelled-appointment/cancelled-appointment';
import {PendingApointment} from './admin/pending-apointment/pending-apointment';
import {BlogPost} from './admin/blog-post/blog-post';
import {PatientForm} from './book-appointment/patient-form/patient-form';

export const routes: Routes = [
  {path:'home', component:HomePage},
  {path:'' , redirectTo:'home',pathMatch:'full'},
  {path:'book-appointment' , component:BookAppointment},
  {path:'patient-info' , component:PatientForm},
  {path:'login', component:Login,data: { animation: 'login' }},
  {path:'sign-up', component:SignUp,data: { animation: 'sign-up' }},
  {path:'doctor-profile', component:DoctorProfile},
  {path:'admin',component:Dashboard , children:[{
    path:'' , component:DashboardHome
    },
      {
        path:'doctors' , component:DashboardDoctors
      },
      {path:'patients' , component:PatientDashboard},
      {path:'appointments' , component:DashboardAppointment,
      children:[
        {path:'', component:AllAppointments},
        {path:'confirmed', component:ConfirmedAppointments},
        {path:'cancelled', component:CancelledAppointment},
        {path:'pending', component:PendingApointment}
      ]},
      {
        path:'blog-posts' ,component:BlogPost
      }
    ]},

];
