import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../shared/api-response';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  httpOptions = {
    headers: new HttpHeaders({ 'content-Type': 'application/json' })
  };
  constructor(private httpClient: HttpClient) {}
  register(
    name: string,
    email: string,
    password: string
  ): Observable<ApiResponse<User>> {
    const body = {
      name: name,
      email: email,
      password: password
    };
    console.log(body);
    let result = this.httpClient.post<ApiResponse<User>>(
      '/users',
      body,
      this.httpOptions
    );
    return result;
  }
}
