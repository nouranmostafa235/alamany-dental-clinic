import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {SideBar} from '../side-bar/side-bar';
import {DoctorsService} from '../../../services/doctors-service';
import {AppointmentsService} from '../../../services/appointments-service';
import {BlogPostService} from '../../../services/blog-post-service';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterOutlet,
    SideBar
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

}
