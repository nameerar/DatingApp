import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

baseUrl = environment.apiUrl;
constructor(private http: HttpClient, private authService: AuthService) { }



getUsers(): Observable<User[]> {
  return this.http.get<User[]>(this.baseUrl + 'users');
}


getUser(id: string | number): Observable<User> {
  return this.http.get<User>(this.baseUrl + 'users/' + id);
}

UpdateUser(id: number, user: User) {
  return this.http.put(this.baseUrl + 'users/' + id, user);
}

SetMainPhoto (userId: number, id: number) {
  return this.http.post( this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {});
}

DeletePhoto (userId: number, id: number) {
 return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id);
}

}
