import { Component, OnInit } from '@angular/core';
import { Pagination, PaginationResult } from '../_models/pagination';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { Message } from '../_models/message';
import { User } from '../_models/user';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
messages: Message[];
pagination: Pagination;
messageContainer = 'Unread';
  constructor(private userServie: UserService, private authservice: AuthService, private route: ActivatedRoute,
     private alertify: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
    });
  }

loadMessages() {
 this.userServie.GetMessages(this.authservice.decodedToken.nameid, this.pagination.currentPage, this.pagination.itemsPerPage,
   this.messageContainer).subscribe((res: PaginationResult<Message[]>) => {
     this.messages = res.result;
     console.log(this.messages);
     this.pagination = res.pagination;
   }, error => {
     this.alertify.error(error);
   }) ;
}
pageChanged(event: any): void {
this.pagination.currentPage = event.page;
this.loadMessages();
}
}
