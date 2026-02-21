import {ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {DatePipe, isPlatformBrowser} from '@angular/common';
import {OurServicesService} from '../../../services/our-services-service';
import {MatDialog} from '@angular/material/dialog';
import {CreateServiceForm} from '../create-service-form/create-service-form';
import {FilterPipe} from '../../../pipes/filter-pipe';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-services-mangement',
  imports: [
    DatePipe,
    FilterPipe,
    FormsModule
  ],
  templateUrl: './services-mangement.html',
  styleUrl: './services-mangement.css',
})
export class ServicesMangement implements OnInit {
  allServices: any;
  searchTerm: string = '';
  constructor(private service: OurServicesService,
              @Inject(PLATFORM_ID) private platformId: Object,
              private cdr: ChangeDetectorRef, private dialog:MatDialog) {

  }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.loadServices()
  }
  loadServices() {
    this.service.getServices().subscribe({
      next: data => {
        this.allServices = data.data.services
        this.cdr.detectChanges();
      }
    })
  }
  openDialog() {
    const dialogRef = this.dialog.open(CreateServiceForm, {});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadServices();
      }
    });
  }
  deleteService(id:any) {
    this.service.deleteService(id).subscribe({
      next: data => {
       this.loadServices();
      }
    })
  }
}
