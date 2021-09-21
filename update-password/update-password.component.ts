import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormControl
} from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { MessageService } from '../shared/message.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from '../shared/message';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {
  isFormVisible: Boolean;

  private userId: string;
  private token: string;
  updatePasswordForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userId = this.activatedRoute.snapshot.paramMap.get('id');
    this.token = this.activatedRoute.snapshot.queryParamMap.get('token');

    console.debug('updatepass', this.userId, this.token);
    this.createForm();
    this.resetPasswordCheck(this.token, this.userId);
  }



  resetPasswordCheck(token: string, userId: string) {
    this.authService.resetPasswordCheck(token, userId).subscribe(
      res => {
        console.log(res, 'fdsfs');

        this.isFormVisible = true;
      },
      err => {
        this.messageService.push(new Message('Not Confirmed', Message.ERROR));
        this.router.navigateByUrl('/');
      }
    );
  }

  resetPasswordConfirm(userId: string, token: string, newPassword: string) {
    this.authService
      .resetPasswordConfirm(userId, token, newPassword)
      .subscribe(res => {
        this.messageService.push(
          new Message('Password Reset Successful', Message.INFO)
        );
        this.router.navigateByUrl('/login');
      });
  }

  createForm() {
    this.updatePasswordForm = this.formBuilder.group({
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', [Validators.required, this.checkPasswords]]
    });
  }

  get newPassword() {
    return this.updatePasswordForm.get('newPassword');
  }
  get confirmNewPassword() {
    return this.updatePasswordForm.get('confirmNewPassword');
  }

  checkPasswords = (
    control: AbstractControl
  ): { [key: string]: any } | null => {
    console.log('checkpass', this, control as FormControl);
    if (this.updatePasswordForm === undefined) {
      return null;
    }
    let pass = this.updatePasswordForm.get('newPassword').value;
    let confirmPass = this.updatePasswordForm.get('confirmNewPassword').value;
    console.log('thih', control, this, pass, confirmPass);

    return pass === confirmPass ? null : { notSame: true };
  };

  submitForm() {
    this.resetPasswordConfirm(
      this.userId,
      this.token,
      this.updatePasswordForm.get('newPassword').value
    );
  }
}
