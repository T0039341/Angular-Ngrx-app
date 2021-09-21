import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "../shared/api-response";
import { LoginResponse } from "../shared/login-response";
import { RefreshTokenResponse } from "../shared/refresh-token-response";
import { Empty } from "../user/empty";

export const REFRESH_TOKEN = "liquiliter_refresh_token";
export const ACCESS_TOKEN = "liquiliter_access_token";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  constructor(private httpClient: HttpClient) {}

  login(
    email: string,
    password: string
  ): Observable<ApiResponse<LoginResponse>> {
    const body = {
      email: email,
      password: password
    };
    let result = this.httpClient.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      body,
      this.httpOptions
    );
    return result;
  }

  refresh(refreshToken: string): Observable<ApiResponse<RefreshTokenResponse>> {
    const body = {
      refresh_token: refreshToken
    };

    return this.httpClient.post<ApiResponse<RefreshTokenResponse>>(
      "/auth/refresh",
      body,
      this.httpOptions
    );
  }

  resetPassword(email: string): Observable<ApiResponse<Empty>> {
    const body = {
      email: email
    };
    let result = this.httpClient.post<ApiResponse<Empty>>(
      "/auth/password-reset",
      body,
      this.httpOptions
    );
    return result;
  }

  resetPasswordCheck(
    refreshToken: string,
    userId: string
  ): Observable<ApiResponse<Empty>> {
    console.log(userId, refreshToken, "jdfns");
    const body = {
      token: refreshToken,
      user_id: userId
    };
    let result = this.httpClient.post<ApiResponse<Empty>>(
      "/auth/password-reset/check",
      body,
      this.httpOptions
    );
    return result;
  }

  resetPasswordConfirm(
    userId: string,
    refreshToken: string,
    newPassword: string
  ): Observable<ApiResponse<Empty>> {
    const body = {
      token: refreshToken,
      user_id: userId,
      new_password: newPassword
    };
    let result = this.httpClient.post<ApiResponse<Empty>>(
      "/auth/password-reset/confirm",
      body,
      this.httpOptions
    );
    return result;
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(REFRESH_TOKEN, token);
  }

  setAccessToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN, token);
  }

  static getToken(): string {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  //for logout
  removeTokens() {
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(ACCESS_TOKEN);
  }
  //this will return a boolean
  loggedIn() {
    return !!localStorage.getItem(ACCESS_TOKEN);
  }

  logOut() {
    this.removeTokens();
  }
}
