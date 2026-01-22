import { Routes } from '@angular/router';
import {HomePage} from './pages/home-pages/home-page';
import {BookAppointment} from './pages/appointments/book-appointment/book-appointment';
import {Login} from './pages/Auth/login/login';
import {SignUp} from './pages/Auth/sign-up/sign-up';
import {DoctorProfile} from './pages/doctor-pages/doctor-profile/doctor-profile';
import {Dashboard} from './pages/admin-pages/dashboard/dashboard';
import {DashboardHome} from './pages/admin-pages/dashboard-home/dashboard-home';
import {DashboardDoctors} from './pages/admin-pages/dashboard-doctors/dashboard-doctors';
import {PatientDashboard} from './pages/admin-pages/patient-dashboard/patient-dashboard';
import {DashboardAppointment} from './pages/admin-pages/dashboard-appointment/dashboard-appointment';
import {AllAppointments} from './pages/admin-pages/all-appointments/all-appointments';
import {ConfirmedAppointments} from './pages/admin-pages/confirmed-appointments/confirmed-appointments';
import {CancelledAppointment} from './pages/admin-pages/cancelled-appointment/cancelled-appointment';
import {PendingApointment} from './pages/admin-pages/pending-apointment/pending-apointment';
import {BlogPost} from './pages/admin-pages/blog-post/blog-post';
import {PatientForm} from './pages/appointments/patient-form/patient-form';
import {BlogPostsPage} from './pages/home-pages/blog-posts-page/blog-posts-page';
import {VerifyEmail} from './pages/Auth/verify-email/verify-email';
import {ServicesMangement} from './pages/admin-pages/services-mangement/services-mangement';
import {Messages} from './pages/admin-pages/messages/messages';
import {DoctorAboutSection} from './pages/doctor-pages/doctor-about-section/doctor-about-section';
import {DoctorCertificates} from './pages/doctor-pages/doctor-certificates/doctor-certificates';
import {DoctorMaterial} from './pages/doctor-pages/doctor-material/doctor-material';
import {DoctorOfficeHourSection} from './pages/doctor-pages/doctor-office-hour-section/doctor-office-hour-section';
import {AppointmentType} from './pages/appointments/appointment-type/appointment-type';
import {AppointmentService} from './pages/appointments/appointment-service/appointment-service';
import {appointmentStepsGuard} from './guards/appointment-steps-guard';
import {FindAppointmentDate} from './pages/appointments/find-appointment-date/find-appointment-date';

export const routes: Routes = [
  {path:'home', component:HomePage},
  {path:'' , redirectTo:'home',pathMatch:'full'},
  {path:'book-appointment' , component:BookAppointment , children:[
      {path: '1' , component: AppointmentType, canActivate:[appointmentStepsGuard]},
      {path: "" , redirectTo:'1' ,pathMatch:'full'} ,
      {path: '2' , component: AppointmentService , canActivate:[appointmentStepsGuard]},
      {path: '3' , component: FindAppointmentDate , canActivate:[appointmentStepsGuard]},
    ]},
  {path:'patient-info' , component:PatientForm},
  {path:'login', component:Login,data: { animation: 'login' }},
  {path:'sign-up', component:SignUp,data: { animation: 'sign-up' }},
  {path:'doctor-profile', component:DoctorProfile , children:[
      {path: '', component: DoctorAboutSection},
      {path: 'material', component: DoctorMaterial},
      {path: 'certificates', component: DoctorCertificates},
      {path: 'office-hours', component: DoctorOfficeHourSection},
    ]},
  {path:'blog-posts' , component:BlogPostsPage},
  {path:'verify-email' , component:VerifyEmail},
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
      },
      {
        path:'services-management' ,component:ServicesMangement
      },
      {
        path:'messages-management' ,component:Messages
      }
    ]},

];
