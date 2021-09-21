import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { RegisterService } from '../register.service';
import { SharedServiceService } from '../../shared/shared.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { MessageService } from 'src/app/shared/message.service';
import { Message } from 'src/app/shared/message';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  email: string;
  password: string;
  name: string;
  tankForm: FormGroup = this.formBuilder.group({
    fullName: ['', Validators.required],
    userEmail: [
      '',
      [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')
      ]
    ],
    userPassword: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(
          '^(?=.*[A-Z])(?=.*[!@#$&*^%*.])(?=.*[0-9])(?=.*[a-z]).{8,}$'
        )
      ]
    ]
  });

  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private registerService: RegisterService,
    private authService: AuthService,
    private sharedService: SharedServiceService,
    private messageService: MessageService,
    private router: Router
  ) {}

  messages = new Array<Message>();

  ngOnInit() {
    // this.createForm();
    if (this.authService.loggedIn) {
      this.router.navigateByUrl('main/tanks');
    }
    this.setupMessages();
  }

  // createForm() {
  // this.tankForm =
  // }

  onSubmit() {
    this.errorMessage = '';
    console.log('in onSubmit()');
    this.registerService
      .register(
        this.tankForm.get('fullName').value,
        this.tankForm.get('userEmail').value,
        this.tankForm.get('userPassword').value
      )

      .subscribe(
        res => {
          this.authService
            .login(
              this.tankForm.get('userEmail').value,
              this.tankForm.get('userPassword').value
            )
            .subscribe(res => {
              this.authService.setAccessToken(res.data.access_token);
              this.router.navigateByUrl('/main/tanks');
            });
          this.valueChanged();
          console.log('rrr', res);

          console.log('tankForm', this.tankForm.value);
          // this.router.navigateByUrl('/login');
        },
        err => {
          this.errorMessage = err;
          console.log('register error', err);
        }
      );
  }

  get userPassword() {
    return this.tankForm.get('userPassword');
  }

  get userEmail() {
    return this.tankForm.get('userEmail');
  }

  get fullName() {
    return this.tankForm.get('fullName');
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
