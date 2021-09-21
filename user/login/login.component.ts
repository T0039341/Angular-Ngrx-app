import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { SharedServiceService } from '../../shared/shared.service';
import { Router } from '@angular/router';
import { MessageService } from '../../shared/message.service';
import { Message } from 'src/app/shared/message';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  data: boolean;

  errorMessage = '';

  constructor(
    private authService: AuthService,
    private sharedservice: SharedServiceService,
    private router: Router,
    private messageService: MessageService
  ) {}

  messages: Message[] = new Array<Message>();

  ngOnInit() {
    if (this.authService.loggedIn) {
      this.router.navigateByUrl('main/tanks');
    }
    this.setupMessages();
  }

  logIn() {
    this.errorMessage = '';
    this.authService.login(this.email, this.password).subscribe(
      res => {
        this.authService.setAccessToken(res.data.access_token);
        this.valueChanged();
        this.router.navigateByUrl('/main/tanks');
        console.log(res);
      },
      err => {
        this.errorMessage = err;
        console.log('login error', err);
      }
    );
  }

  forgotPassword() {
    this.router.navigateByUrl('/password-reset');
  }

  valueChanged() {
    this.sharedservice.push(true);
  }

  setupMessages() {
    this.messageService.currentStream.subscribe(res => {
      this.messages.push(res);

      setTimeout(() => {
        this.messages.splice(this.messages.indexOf(res), 1);
        console.log('deleeting message');
      }, 8000);
    });
  }

  clearMessage() {
    return this.messages.splice(this.messages.length - 1);
  }

  deleteMessageEvent($event) {
    this.messages.splice(this.messages.indexOf($event), 1);
  }
}
