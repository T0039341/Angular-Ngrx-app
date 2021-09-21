import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { SharedServiceService } from 'src/app/shared/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MessageService } from '../../shared/message.service';
import { Message } from '../../shared/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  resetPasswordForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private sharedService: SharedServiceService,
    private messageService: MessageService,
    private router: Router
  ) {}

  messages = new Array<Message>();

  ngOnInit() {
    this.createForm();
    this.setupMessages();
  }

  createForm() {
    this.resetPasswordForm = this.formBuilder.group({
      userEmail: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$')
        ]
      ]
    });
  }

  passwordReset(email = this.resetPasswordForm.get('userEmail').value) {
    this.authService.resetPassword(email).subscribe(res => {
      console.log(res, 'Password Reset Successful');
      this.messageService.push(
        new Message(
          'Email sent successfully. Please check your inbox',
          Message.INFO
        )
      );
      this.router.navigateByUrl('/login');

      this.valueChanged();
    });
  }

  get userEmail() {
    return this.resetPasswordForm.get('userEmail');
  }

  valueChanged() {
    this.sharedService.push(true);
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
