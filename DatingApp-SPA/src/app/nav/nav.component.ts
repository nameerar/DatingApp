import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { retry } from 'rxjs/operators';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
model: any = {};
  constructor(public authServie: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
  }

  login() {
    this.authServie.login(this.model).subscribe(
next => {
  this.alertify.success('logged in Succesfully');
}, error => {this.alertify.error(error); });
}


loggedIn() {
return this.authServie.loggedIn();

}

logout() {
localStorage.removeItem('token');
this.alertify.message('logged out');
}


}
