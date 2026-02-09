import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {CreateServiceForm} from '../create-service-form/create-service-form';
import {MatDialog} from '@angular/material/dialog';
import {CreateDoctor} from '../create-doctor/create-doctor';

@Component({
  selector: 'app-dashboard-doctors',
  imports: [
    RouterLink
  ],
  templateUrl: './dashboard-doctors.html',
  styleUrl: './dashboard-doctors.css',
})
export class DashboardDoctors {
  constructor(private dialog: MatDialog) {
  }
  openDialog() {
    this.dialog.open(CreateDoctor,{})
  }
}
