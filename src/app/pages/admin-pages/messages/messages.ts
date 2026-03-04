import {ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {MessagesService} from '../../../services/messages-service';
import {DatePipe, isPlatformBrowser} from '@angular/common';
import {ConfirmationDialog} from '../../../shared-components/confirmation-dialog/confirmation-dialog';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-messages',
  imports: [
  ],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages implements OnInit{
 allMessages: any;
 constructor(private messageService: MessagesService,
             private dialog: MatDialog,
             @Inject(PLATFORM_ID) private platformId: Object,
             private cdr: ChangeDetectorRef) {
 }
 ngOnInit() {
   if (!isPlatformBrowser(this.platformId)) {
     return;
   }
  this.loadMessages();
 }
 loadMessages() {
   this.messageService.getMessages().subscribe({
     next: (data) => {
       this.allMessages = data.data.messages;
       this.cdr.detectChanges();
     }
   })
 }

  deleteMessage(id: any) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '400px',
      data: { message: 'Are you sure you want to delete this message?', status: 'delete' }
    });

    dialogRef.afterClosed().subscribe((confirmed:any) => {
      if (confirmed) {
        this.messageService.deleteMessage(id).subscribe({
              next: data => {
                this.loadMessages();
              }
            })
      }
    });
  }
}
