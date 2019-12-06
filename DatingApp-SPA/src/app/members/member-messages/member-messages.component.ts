import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
@Input() recipientId: number;
messages: Message[];
  constructor(private userservice: UserService, private authservice: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
  }

loadMessages() {
  this.userservice.getMessageThread(this.authservice.decodedToken.nameid, this.recipientId).
  subscribe(messages => {
    this.messages = messages;
  }, error => {
    this.alertify.error(error);
  });
}






}
