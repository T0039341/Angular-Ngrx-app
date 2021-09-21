import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TankService } from '../tank.service';
import { SharedServiceService } from 'src/app/shared/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { MessageService } from '../../shared/message.service';



@Component({
  selector: 'app-tank-details',
  templateUrl: './tank-details.component.html',
  styleUrls: ['./tank-details.component.scss'],
  providers: [DatePipe]
})
export class TankDetailsComponent implements OnInit {
  public id: string;

  tank: any;

  constructor(
    private tankService: TankService,
    private sharedService: SharedServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(url => {
      console.log(+url.get('id'), 'calling gettanks');
      this.id = url.get('id');
      this.onPickTank(this.id);
    });
  }

  onPickTank(id: string) {
    this.tankService.getTankById(id).subscribe(
      res => {
        this.tank = res.data;
      },
      err => {
        console.log(err);
        if (err.error.status === 404) {
          this.router.navigateByUrl('/page-not-found');
        }
      }
    );
  }
}
