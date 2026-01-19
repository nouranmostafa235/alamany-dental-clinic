import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {OurServicesService} from '../../../services/our-services-service';
import {MatDialog} from '@angular/material/dialog';
import {CreateServiceForm} from '../create-service-form/create-service-form';

@Component({
  selector: 'app-services-mangement',
  imports: [
    DatePipe
  ],
  templateUrl: './services-mangement.html',
  styleUrl: './services-mangement.css',
})
export class ServicesMangement implements OnInit {
  allServices: any;
  constructor(private service: OurServicesService,
              private cdr: ChangeDetectorRef, private dialog:MatDialog) {

  }

  ngOnInit() {
    this.service.getServices().subscribe({
      next: data => {
        this.allServices = data.data.services
        this.cdr.detectChanges();
      }
    })
  }
  openDialog() {
    this.dialog.open(CreateServiceForm,{})
  }
}
