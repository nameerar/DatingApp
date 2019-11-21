import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { retry } from 'rxjs/operators';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';
import { User } from '../_models/user';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
model: any = {};
photoUrl: string;
  constructor(public authServie: AuthService, private alertify: AlertifyService, private router: Router) { }

  ngOnInit() {
    this.authServie.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  login() {
    console.log(Date.now());
    if (!this.model) {
      return this.alertify.error('Please enter username or password');

    }
    this.authServie.login(this.model).subscribe(
next => {
  this.alertify.success('logged in Succesfully');
}, error => {this.alertify.error(error); },
() => {
  this.router.navigate(['/members']);
});
}


loggedIn() {
return this.authServie.loggedIn();

}

logout() {
localStorage.removeItem('token');
localStorage.removeItem('user');
this.authServie.decodedToken = null;
this.authServie.currentUser = null;
this.alertify.message('logged out');
this.router.navigate(['/']);
}



}
