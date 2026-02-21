import {ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MessagesService} from '../../../services/messages-service';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-messages',
    imports: [],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages implements OnInit{
 allMessages: any;
 constructor(private messageService: MessagesService,
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
}
