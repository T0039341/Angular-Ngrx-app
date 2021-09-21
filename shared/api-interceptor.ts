import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';

import { EMPTY, Observable, throwError } from 'rxjs';
import { AuthService } from '../shared/auth.service';
import { catchError, retry } from 'rxjs/operators';
import { MessageService } from './message.service';
import { Message } from './message';
import { SharedServiceService } from './shared.service';
import { ApiError } from './api-error';

@Injectable({ providedIn: 'root' })
export class ApiInterceptor implements HttpInterceptor {
  baseUrl = 'https://api.liquiliter.com';
  // baseUrl = 'http://localhost:8080';

  constructor(
    private messageService: MessageService,
    private sharedService: SharedServiceService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let apiReq;
    if (
      (req.url === '/users' && req.method === 'POST') ||
      req.url === '/auth/login' ||
      req.url === '/auth/password-reset' ||
      req.url === '/auth/password-reset/check' ||
      req.url === '/auth/password-reset/confirm'
    ) {
      apiReq = req.clone({
        url: `${this.baseUrl}${req.url}`
      });
    } else {
      apiReq = req.clone({
        url: `${this.baseUrl}${req.url}`,
        headers: new HttpHeaders({
          Authorization: AuthService.getToken()
        })
      });
    }

    console.log(apiReq);

    return next.handle(apiReq).pipe(
      retry(3),
      catchError((error: HttpErrorResponse) => {
        console.log(
          '%o',
          error,
          error instanceof ErrorEvent
          // error.error.error.title
        );
        let errorMessage = '';
        if (error instanceof ErrorEvent) {
          // client Side Error
          errorMessage = `Error:Client Side`;
          console.log('client sidezzz');
        } else {
          // server side
          if (error.status === 0) {
            // Connection Error
            errorMessage = 'Cannot connect to server';
            // tslint:disable-next-line: no-shadowed-variable
            const message = new Message();
            message.data = errorMessage;
            message.type = Message.ERROR;
            console.log('ssdfkjhfb');
            this.messageService.push(message);

            return EMPTY;
          }
          if (error.error != null && error.error.error != null) {
            console.log('error not null');
            errorMessage = `${error.error.error.detail}`;
          }
        }

        const message = new Message();
        message.data = errorMessage;
        console.log('pushing the messages tooyoryo');
        message.type = Message.ERROR;

        console.log('service', this.messageService);
        console.log('message', message);
        if (
          (req.url === '/auth/login' &&
            error.status < 500 &&
            error.status > 400) ||
          (req.url === '/users' && error.status < 500 && error.status > 400) ||
          (req.url === '/users/current/password' && error.status === 401)
        ) {
          return throwError(error.error.error.detail);
        } else if (error.status === 401) {
          console.log('401 errorrrz ');
          const err = new ApiError();
          err.id = error.error.error.id;
          err.detail = error.error.error.detail;
          err.status = error.error.error.status;
          err.title = error.error.error.title;
          this.sharedService.push(err);
          return EMPTY;
        } else if (error.status === 409) {
          console.log('409 error');
          return throwError(error.error.error.detail);
        } else {
          this.messageService.push(message);
        }
        console.log('An Error has Occured');
        return throwError(error.error);
      })
    );
  }
}
