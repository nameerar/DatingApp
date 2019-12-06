import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { AuthService } from './auth.service';
import { PaginationResult } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { PaginationModule } from 'ngx-bootstrap';
import { Message } from '../_models/message';



@Injectable({
  providedIn: 'root'
})
export class UserService {

baseUrl = environment.apiUrl;
constructor(private http: HttpClient, private authService: AuthService) { }



getUsers(page?, itemsPerPage?, userParams?, likesParam?): Observable<PaginationResult<User[]>> {
  const paginatedResult: PaginationResult<User[]> = new PaginationResult<User[]>();
 let params = new HttpParams();
 if (page != null && itemsPerPage != null) {
   params = params.append('pageNumber', page);
   params = params.append('pageSize', itemsPerPage);
 }

 if (userParams != null) {
   params = params.append('minAge', userParams.minAge);
   params = params.append('maxAge', userParams.maxAge);
   params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);
 }

 if (likesParam === 'likers') {
   params = params.append('likers', 'true');
 }

 if (likesParam === 'likees') {
  params = params.append('likees', 'true');
   }

  return this.http.get<User[]>(this.baseUrl + 'users', {observe: 'response', params}).
  pipe(
    map(response => {
      paginatedResult.result = response.body;
      if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
      }
      return paginatedResult;
    })
  );
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

SendLike(id: number, recipientId: number) {
  return this.http.post(this.baseUrl + 'users/' + id + '/like/' + recipientId, {});
}

GetMessages(id: number, page?, itemsPerPage?, messageContainer? ) {
  const paginationResult: PaginationResult<Message[]> = new PaginationResult<Message[]>();

  let params = new HttpParams();

  params = params.append('MessageContainer', messageContainer);
  if (page != null && itemsPerPage != null) {
    params = params.append('pageNumber', page);
    params = params.append('pageSize', itemsPerPage);
  }

  return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages', {observe: 'response', params}).
  pipe(
    map(
      reponse => {
        paginationResult.result = reponse.body;
        if (reponse.headers.get('Pagination') !== null) {
             paginationResult.pagination = JSON.parse(reponse.headers.get('Pagination'));
        }
        return paginationResult;
      }

    ));
}
getMessageThread(id: number, recipientId: number) {
 return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages/thread/' + recipientId);


}
}
