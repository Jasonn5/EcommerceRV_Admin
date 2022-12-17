import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { JwtDecodeService } from './jwt-decode.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtDecodeService: JwtDecodeService
  ) { }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    
    return token != null;
  }

  login(username: string, password: string) {
    var user = new User();

    //@ts-ignore
    user.id = 0;
    user.username = username;
    user.password = password;
    user.firstName= username;
    user.lastName = username;
    user.confirmPassword = password;

    const reqHeader = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return this.http.post<any>(environment.BACK_END_HOST + 'users/authenticate',  user , reqHeader)
      .pipe(
        map(user => {
          localStorage.setItem('token', user.token);
          localStorage.setItem('username', user.username);
          localStorage.setItem('roles', this.jwtDecodeService.decodeToken(user.token)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
          localStorage.setItem('userid', this.jwtDecodeService.decodeToken(user.token)['user_id']);
          localStorage.setItem('expires', this.jwtDecodeService.decodeToken(user.token)['exp']);

          return true;
        })
      );
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUsername() {
    return localStorage.getItem('username');
  }

  getUserId() {
    return localStorage.getItem('userid');
  }

  getRoles() {
    var roles = localStorage.getItem('roles');
    if (roles) {
      return roles.split(',');
    }
    else {
      return [];
    }
  }

  tokenHasExpired() {
    var convertDate = parseInt(localStorage.getItem('expires')) * 1000;
    var expireDate = new Date(convertDate);
    var currentDate = new Date();

    return currentDate > expireDate;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
    localStorage.removeItem('userid');
    localStorage.removeItem('expires');
    this.router.navigate(['/login']);
  }
}
