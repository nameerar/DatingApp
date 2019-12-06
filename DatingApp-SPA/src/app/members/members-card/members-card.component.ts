import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-members-card',
  templateUrl: './members-card.component.html',
  styleUrls: ['./members-card.component.css']
})
export class MembersCardComponent implements OnInit {
@Input() user: User;



  constructor(private authservice: AuthService, private userservice: UserService, private alertify: AlertifyService) { }

  ngOnInit() {
  }


sendlike(id: number) {
  this.userservice.SendLike(this.authservice.decodedToken.nameid, id).subscribe(data => {
    this.alertify.success('You have liked' + this.user.knownAs);
  }, error => {
    this.alertify.error('You have already liked this user');
  });
}

}
