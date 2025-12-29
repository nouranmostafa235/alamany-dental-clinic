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

export const routes: Routes = [
  {path:'home', component:HomePage},
  {path:'' , redirectTo:'home',pathMatch:'full'},
  {path:'book-appointment' , component:BookAppointment},
  {path:'login', component:Login,data: { animation: 'login' }},
  {path:'sign-up', component:SignUp,data: { animation: 'sign-up' }},
  {path:'doctor-profile', component:DoctorProfile},
  {path:'admin',component:Dashboard , children:[{
    path:'' , component:DashboardHome
    },
      {
        path:'doctors' , component:DashboardDoctors
      },
      {path:'patients' , component:PatientDashboard}
    ]}
];
