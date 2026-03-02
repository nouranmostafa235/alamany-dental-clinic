import {ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {DatePipe, isPlatformBrowser} from '@angular/common';
import {OurServicesService} from '../../../services/our-services-service';
import {MatDialog} from '@angular/material/dialog';
import {CreateServiceForm} from '../create-service-form/create-service-form';
import {FilterPipe} from '../../../pipes/filter-pipe';
import {FormsModule} from '@angular/forms';
import {ConfirmationDialog} from '../../../shared-components/confirmation-dialog/confirmation-dialog';

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
  openDialog(service: any = null) {
    const dialogRef = this.dialog.open(CreateServiceForm, {
      // width: '600px',
      data: {
        mode: service ? 'edit' : 'create',
        service: service
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadServices();
      }
    });
  }
  deleteService(id:any) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '400px',
      data: { message: 'Are you sure you want to delete this Service?' , status: 'delete' }
    });
    dialogRef.afterClosed().subscribe((confirmed:any) => {
      if (confirmed) {
        this.service.deleteService(id).subscribe({
          next: data => {
            this.loadServices();
          }
        })
      }
    });
  }

}
