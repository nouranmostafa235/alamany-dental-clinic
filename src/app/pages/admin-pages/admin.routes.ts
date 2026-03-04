import { Routes } from '@angular/router';
import {DashboardHome} from './dashboard-home/dashboard-home';
import {DashboardDoctors} from './dashboard-doctors/dashboard-doctors';
import {PatientDashboard} from './patient-dashboard/patient-dashboard';
import {DashboardAppointment} from './dashboard-appointment/dashboard-appointment';
import {AllAppointments} from './all-appointments/all-appointments';
import {ConfirmedAppointments} from './confirmed-appointments/confirmed-appointments';
import {CancelledAppointment} from './cancelled-appointment/cancelled-appointment';
import {PendingApointment} from './pending-apointment/pending-apointment';
import {BlogPost} from './blog-post/blog-post';
import {ServicesMangement} from './services-mangement/services-mangement';
import {Messages} from './messages/messages';


export const ADMIN_ROUTES: Routes = [
  { path: '', component: DashboardHome },
  { path: 'doctors', component: DashboardDoctors },
  { path: 'patients', component: PatientDashboard },
  {
    path: 'appointments',
    component: DashboardAppointment,
    children: [
      { path: '', component: AllAppointments },
      { path: 'confirmed', component: ConfirmedAppointments },
      { path: 'cancelled', component: CancelledAppointment },
      { path: 'pending', component: PendingApointment }
    ]
  },
  { path: 'blog-posts', component: BlogPost },
  { path: 'services-management', component: ServicesMangement },
  { path: 'messages-management', component: Messages }
];
