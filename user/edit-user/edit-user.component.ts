import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import * as bulmaAccordion from 'bulma-extensions/bulma-accordion/dist/js/bulma-accordion.min.js';
import { SharedServiceService } from 'src/app/shared/shared.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../user';
import { MessageService } from 'src/app/shared/message.service';
import { Message } from 'src/app/shared/message';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  userForm: FormGroup;
  passwordForm: FormGroup;
  user: User;
  constructor(
    private userService: UserService,
    private sharedService: SharedServiceService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.createUserForm();
    // this.createPasswordForm();
    this.getUser();
  }

  createUserForm() {
    this.userForm = this.formBuilder.group({
      fullName: [{ value: '' }, Validators.required],
      userEmail: [{ value: '', disabled: true }, Validators.required],
      passwordGroup: this.formBuilder.group({
        oldPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(
              '^(?=.*[A-Z])(?=.*[!@#$&*^%*.])(?=.*[0-9])(?=.*[a-z]).{8,}$'
            )
          ]
        ],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(
              '^(?=.*[A-Z])(?=.*[!@#$&*^%*.])(?=.*[0-9])(?=.*[a-z]).{8,}$'
            )
          ]
        ]
      })
    });

    // this.passwordForm = this.formBuilder.group({
    //   userOldPassword: [
    //     '',
    //     [
    //       Validators.required,
    //       Validators.minLength(6),
    //       Validators.pattern(
    //         '^(?=.*[A-Z])(?=.*[!@#$&*^%*.])(?=.*[0-9])(?=.*[a-z]).{8,}$'
    //       )
    //     ]
    //   ],
    //   userNewPassword: [
    //     '',
    //     [
    //       Validators.required,
    //       Validators.minLength(6),
    //       Validators.pattern(
    //         '^(?=.*[A-Z])(?=.*[!@#$&*^%*.])(?=.*[0-9])(?=.*[a-z]).{8,}$'
    //       )
    //     ]
    //   ]
    // });
  }

  // createPasswordForm() {
  //   this.passwordForm = this.formBuilder.group({
  //     userOldPassword: [
  //       '',
  //       [
  //         Validators.required,
  //         Validators.minLength(6),
  //         Validators.pattern(
  //           '^(?=.*[A-Z])(?=.*[!@#$&*^%*.])(?=.*[0-9])(?=.*[a-z]).{8,}$'
  //         )
  //       ]
  //     ],
  //     userNewPassword: [
  //       '',
  //       [
  //         Validators.required,
  //         Validators.minLength(6),
  //         Validators.pattern(
  //           '^(?=.*[A-Z])(?=.*[!@#$&*^%*.])(?=.*[0-9])(?=.*[a-z]).{8,}$'
  //         )
  //       ]
  //     ]
  //   });
  // }

  onSubmit() {
    console.log('in onSubmit()');
    console.log('updating user()');
    this.userService
      .editUser(
        this.userForm.get('fullName').value,
        this.userForm.get('userEmail').value
      )
      .subscribe(res => {
        this.valueChanged();
        const message = new Message('User updated successfully!', Message.INFO);
        this.messageService.push(message);
        console.log('rrr', res);
      });
  }

  changePassword(): any {
    console.log('updating password()');
    this.userService
      .changePassword(this.oldPassword.value, this.newPassword.value)
      .subscribe(
        res => {
          this.valueChanged();
          this.authService.setAccessToken(res.data.access_token);
          this.messageService.push(
            new Message('Password Updated Successfully', Message.INFO)
          );
          console.log(res);
          console.log('pass');
        },
        err => {
          const message = new Message(err, Message.ERROR);
          this.messageService.push(message);
        }
      );
  }

  valueChanged() {
    this.sharedService.push(true);
  }

  getUser(): any {
    this.userService.getUser().subscribe(res => {
      console.log(res);
      let user = res.data;
      this.userForm.get('fullName').setValue(user.name);
      this.userForm.get('userEmail').setValue(user.email);
      this.valueChanged();
      bulmaAccordion.attach();
    });
  }

  get oldPassword() {
    return this.passwordGroup.get('oldPassword');
  }

  get newPassword() {
    return this.passwordGroup.get('newPassword');
  }

  get fullName() {
    return this.userForm.get('fullName');
  }

  get userEmail() {
    return this.userForm.get('userEmail');
  }

  get userPassword() {
    return this.userForm.get('userPassword');
  }

  get passwordGroup() {
    return this.userForm.get('passwordGroup');
  }

  get name() {
    return this.userForm.get('fullName');
  }
}
