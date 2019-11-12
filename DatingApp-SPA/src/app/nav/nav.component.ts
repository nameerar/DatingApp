import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { retry } from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
model: any = {};
  constructor(private authServie: AuthService) { }

  ngOnInit() {
  }

  login() {
    this.authServie.login(this.model).subscribe(
next => {
  console.log('logged in Succesfully');
}, error => {console.log(error); });
}


loggedIn() {
const token = localStorage.getItem('token');
return !!token;

}

logout() {
localStorage.removeItem('token');
console.log('logged out');
}


}
