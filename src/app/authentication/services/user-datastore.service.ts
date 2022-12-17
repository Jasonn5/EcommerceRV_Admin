import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserDatastoreService {
  readonly ROOT_URL = `${environment.BACK_END_HOST}users`;

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<User[]>(this.ROOT_URL);
  }

  findById(id) {
    return this.http.get<User>(this.ROOT_URL + '/' + id);
  }

  update(userToEdit: User) {
    return this.http.patch<User>(this.ROOT_URL + '/' + userToEdit.id, userToEdit);
  }

  add(user: User) {
    return this.http.post<User>(this.ROOT_URL, user);
  }

  changePassword(user: User) {
    return this.http.post<any>(environment.BACK_END_HOST + 'users/changepassword', user);
  }
}
