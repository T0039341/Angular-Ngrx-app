import { Component, OnInit, HostListener } from '@angular/core';
import { TankService } from '../tanks/tank.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tank } from '../tanks/tank';
import { SharedServiceService } from '../shared/shared.service';
import { MessageService } from '../shared/message.service';
import { Message } from '../shared/message';

@Component({
  selector: 'app-tank-verification',
  templateUrl: './tank-verification.component.html',
  styleUrls: ['./tank-verification.component.scss']
})
export class TankVerificationComponent implements OnInit {
  timeString: string;
  duration = 5;
  seconds = '--';
  minutes = '--';
  clockDisplay: string;
  interval: number;
  timer;
  id: string;
  is_verified: boolean;

  isModalVisible = false;

  isCancelClicked = false;

  isCancelModalVisible = false;

  isRedirectionForced = false;

  constructor(
    private tankService: TankService,
    private route: ActivatedRoute,
    private sharedService: SharedServiceService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getInitialTank();
  }

// tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.timer = clearInterval(this.timer);
    this.isCancelClicked = false;
  }

  startTimer() {
    this.duration = 180;
    this.timer = setInterval(() => {
      this.duration = this.duration - 1;
      if (this.duration <= 0) {
        this.getTank(false);
        this.stopTimer();
      }
      if (this.duration % 60 < 10) {
        this.seconds = '0' + (this.duration % 60);
      } else {
        this.seconds = (this.duration % 60).toString();
      }
      if (this.duration / 60 < 10) {
        this.minutes = '0' + parseInt('' + this.duration / 60, 10);
        console.log('duration ', this.minutes);
      } else {
        this.minutes = '' + parseInt((this.duration / 60).toString(), 10);
      }
      this.clockDisplay = this.minutes + ':' + this.seconds;
      if (this.duration % 10 == 0) {
        this.getTank(true);
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timer);
    this.duration = 0;
  }

  verifResult: any;
  verifyTank(id: string) {
    this.tankService.verifyTank(id).subscribe(res => {
      this.verifResult = res.data;
      this.valueChanged();
    });
  }

  private getInitialTank() {
    this.tankService.getTankById(this.id).subscribe(
      res => {
        if (res.data.sensor.is_verified) {
          let message = new Message('Tank is already verified', Message.INFO);
          this.messageService.push(message);
          this.isRedirectionForced = true;
          this.router.navigateByUrl('/main/tanks/' + this.id);
          return;
        } else {
          this.verifyTank(this.id);
          this.startTimer();
        }
      },
      err => {
        console.log('getInitalTank(): ', err);
      }
    );
  }

  getTank(isTimerEvent: boolean) {
    this.tankService.getTankById(this.id).subscribe(res => {
      console.log(res);
      console.log('Get Verified Tank Request');

      if (!res.data.sensor.is_verified) {
        if (!isTimerEvent) {
          // Show modal.
          this.isModalVisible = true;
        }
      } else {
        // Navigate to tanks components.
        this.isRedirectionForced = true;
        this.router.navigateByUrl('/main/tanks/' + this.id + '?page=1');
        this.messageService.push(
          new Message('Tank verified successfully', Message.INFO)
        );
      }
    });
  }

  onTryAgainClicked() {
    this.isModalVisible = false;
    this.startTimer();
    this.verifyTank(this.id);
  }

  onTimerNoClicked() {}

  onCancelClicked() {
    console.log('main');
    this.isCancelClicked = true;
    this.router.navigateByUrl('/main/tanks' + '?page=1');
  }

  canDeactivate() {
    if (this.isRedirectionForced) {
      this.isRedirectionForced = false;
      return true;
    }
    this.isCancelModalVisible = true;
    return this.isCancelClicked;
  }

  valueChanged() {
    this.sharedService.push(true);
  }
}
