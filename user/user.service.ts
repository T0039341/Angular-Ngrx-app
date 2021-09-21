import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { User } from './user';
import { Observable } from 'rxjs';
import { ApiResponse } from '../shared/api-response';
import { ActivatedRoute } from '@angular/router';
import { Empty } from './empty';
import { LoginResponse } from '../shared/login-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  httpOptions = {
    headers: new HttpHeaders({ 'content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient, private route: ActivatedRoute) {}

  editUser(name: string, email: string): Observable<ApiResponse<User>> {
    const body = {
      name: name,
      email: email
    };
    let result = this.httpClient.put<ApiResponse<User>>(
      '/users/current',
      body,
      this.httpOptions
    );
    return result;
  }

  getUser(): Observable<ApiResponse<User>> {
    let result = this.httpClient.get<ApiResponse<User>>('/users/current');
    return result;
  }

  changePassword(
    oldpassword: string,
    newpassword: string
  ): Observable<ApiResponse<LoginResponse>> {
    const body = {
      old_password: oldpassword,
      new_password: newpassword
    };
    let result = this.httpClient.post<ApiResponse<LoginResponse>>(
      '/users/current/password',
      body
    );
    return result;
  }
}
