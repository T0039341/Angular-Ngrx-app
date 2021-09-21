import { Component } from '@angular/core';
import { SharedServiceService as SharedService } from './shared/shared.service';
import { AuthService } from './shared/auth.service';
import { Router } from '@angular/router';
import { Message } from './shared/message';
import { ApiError } from './shared/api-error';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private sharedservice: SharedService,
    private authservice: AuthService,
    private router: Router
  ) {}
  title = 'liquiliter-frontend';

  isOpen = true;

  messages: Message[] = new Array<Message>();

  toggle() {
    this.isOpen = !this.isOpen;
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnInit() {
    this.sharedservice.currentDataStream.subscribe(data => {
      console.log(data, 'data string ', data != null, data instanceof ApiError);
      if (data != null && data instanceof ApiError && data.status === 401) {
        console.log(data.detail, 'detail data');
        this.authservice.logOut();
        this.router.navigateByUrl('/login');
      }
      console.log('in app component', data);
    });
  }

  sendData() {
    this.sharedservice.push(true);
  }
}
