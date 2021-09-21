import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { SharedServiceService } from '../shared/shared.service';
import { TankService } from './tank.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import {
  filter,
  startWith,
  pairwise,
  map,
  flatMap,
  mergeMap
} from 'rxjs/operators';
import { MessageService } from '../shared/message.service';

import { faCoffee, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Message } from '../shared/message';

import { Rect } from './rect';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-tanks',
  templateUrl: './tanks.component.html',
  styleUrls: ['./tanks.component.scss'],
  animations: [
    trigger('animationTrigger', [
      state(
        'open',
        style({
          opacity: 1,
          backgroundColor: 'yellow'
        })
      ),
      state(
        'closed',
        style({
          opacity: 0.5,
          backgroundColor: 'red'
        })
      ),
      transition('open => closed', [animate('1s')]),
      transition('closed => open', [animate('0.5s')])
    ])
  ]
})
export class TanksComponent implements OnInit {
  @ViewChild('myCanvas') myCanvas: ElementRef;
  myData: any[];
  alltanks: any[];
  tanklist: any;

  temp = 25;
  currentPage: number;
  nextpages?: number[] = null;
  previouspages?: number[] = null;
  finalpage?: number = null;
  initialPage?: number = null;
  faCoffee: any;
  faTrash: any;

  selectedTankId: any;
  selectedTankIndex: any;

  isModalVisible: boolean;

  numberOfTanks: number;

  constructor(
    private sharedService: SharedServiceService,
    private tankService: TankService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.faCoffee = faCoffee;
    this.faTrash = faTrash;

    this.router.events
      .pipe(
        startWith(new NavigationEnd(0, '/', '/')),
        filter(e => e instanceof NavigationEnd),
        pairwise(),
        map(arr => arr[1] as NavigationEnd)
      )
      .subscribe(res => {
        // Update navigation item selection.
        console.log('Fetching events', res.url);

        console.log('on tanks');
        const url = res.url;
        const components = url.split('?');

        if (
          components[0].endsWith('/tanks') ||
          components[0].endsWith('/settings')
        ) {
          this.selectedTankId = null;
          this.selectedTankIndex = null;
        }
      });
  }

  ngOnInit() {
    // if (this.route.snapshot.queryParamMap.get('page') === '') {
    //   this.currentPage = 1;
    // } else {
    //   this.currentPage = +this.route.snapshot.queryParamMap.get('page');
    // }
    // this.onPaginationChange();

    // this.drawCanvas();
    this.sharedService.currentDataStream.subscribe((event: any) => {
      switch (event.type) {
        case 'LoadTanksEvent':
          this.numberOfTanks = event.data.numberOfTanks;
      }
    });
  }

  onPaginationChange() {
    // this.route.queryParamMap.subscribe(url => {
    //   console.log(+url.get('page'), 'calling gettanks');
    //   this.getTanks(+url.get('page'));
    // });
  }

  // getTanks(page: number = 1) {
  //   this.tankService.getTanks(page, 1).subscribe(res => {
  //     this.alltanks = res.data.results;
  //     this.valueChanged();
  //     this.paginationOrganizer(res.data.page, res.data.total_pages);
  //     console.log(this.alltanks);
  //   });
  // tslint:disable-next-line: no-unused-expression
  // error => {
  //   console.log('Error Occured: ', error);
  // };
  // }

  deleteTank() {
    console.log('this.selected', this.selectedTankId, this.selectedTankIndex);
    this.tankService.deleteTank(this.selectedTankId).subscribe(res => {
      this.alltanks.splice(this.selectedTankIndex, 1);
      this.messageService.push(
        new Message('Tank Deleted Successfully!', Message.INFO)
      );
      this.selectedTankId;

      //   // get the index
      //   // slice
      //   this.valueChanged();
    });
  }

  checkPageLimit() {
    if (this.currentPage < 1) {
      this.currentPage = 1;
    } else if (this.currentPage > this.finalpage) {
      this.currentPage = this.finalpage;
    }
  }

  paginationOrganizer(tankpage: number, pages: number) {
    this.initialPage = null;
    this.finalpage = null;
    this.previouspages = null;
    this.nextpages = null;
    this.currentPage = tankpage;

    if (tankpage > 1) {
      this.initialPage = 1;
    }

    if (tankpage < pages) {
      this.finalpage = pages;
    }

    if (this.initialPage != null && this.currentPage - this.initialPage > 1) {
      console.log('rere', this.currentPage - this.initialPage);
      this.previouspages = Array(1).fill(tankpage - 1);
    } else {
      this.previouspages = null;
      console.log('elseprevious', this.previouspages);
    }

    if (this.finalpage - tankpage > 1) {
      this.nextpages = Array(1).fill(tankpage + 1);
    } else {
      this.nextpages = null;
    }
  }

  drawCanvas() {
    const canvas = this.myCanvas.nativeElement;
    const parent = canvas.parentElement.parentElement;
    console.log(
      'parent',
      parent,
      parent.style,
      parent.clientWidth,
      parent.clientHeight
    );
    const ctx = canvas.getContext('2d');
    const startAngle = 135;
    console.log('context!', ctx);
    const endAngle = startAngle + 270;

    const canvasWidth = parent.clientWidth;
    const canvasHeight = parent.clientHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const minTemp = 0;
    const maxTemp = 50;

    let tempPercentage = (this.temp / (maxTemp - minTemp)) * 100;
    console.log('temper percentage', tempPercentage);

    // Setup bounds.
    let side = canvasWidth;
    if (canvasHeight < canvasWidth) {
      side = canvasHeight;
    }

    // draw reference rect

    // first find the coordinates of the starting top left
    // subtract the full width from the side of rect and divide it by 2
    // to get the location for the rect start and same for bounds Y

    const boundsX = (canvas.width - side) / 2;
    const boundsY = (canvas.height - side) / 2;

    // make the new rect giving it , the coordinates of the top left
    // point and width and height

    const bounds = new Rect(boundsX, boundsY, side, side);

    // calculate radius (-20 because it went out of bounds)
    const radius = side / 2 - 20;
    console.log('canvas', canvas.width, canvas.height, side);
    console.log('bounds', bounds);

    // draw the actual rectangle

    ctx.fillStyle = '#0F0';
    ctx.rect(bounds.x, bounds.y, bounds.width, bounds.height);
    ctx.fill();

    // find the center of the rect

    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;
    console.log('rect center', centerX, centerY);

    // Draw the initial Arc
    ctx.beginPath();
    ctx.strokeStyle = '#fff';
    ctx.arc(
      centerX,
      centerY,
      radius,
      this.deg2rad(startAngle),
      this.deg2rad(endAngle),
      false
    );
    ctx.stroke();

    // Draw the colored Arc
    ctx.beginPath();
    ctx.strokeStyle = '#F00';
    ctx.lineWidth = 3;
    ctx.arc(
      centerX,
      centerY,
      radius,
      this.deg2rad(startAngle),
      this.deg2rad(
        startAngle + (tempPercentage / 100) * (endAngle - startAngle)
      ),
      false
    );
    ctx.stroke();

    // set the coordinates for the small circle
    const x =
      centerX +
      radius *
        Math.cos(
          this.deg2rad(
            startAngle + (tempPercentage / 100) * (endAngle - startAngle)
          )
        );
    const y =
      centerY +
      radius *
        Math.sin(
          this.deg2rad(
            startAngle + (tempPercentage / 100) * (endAngle - startAngle)
          )
        );

    // start drawing the small circle
    ctx.beginPath();
    ctx.fillStyle = '#F00';
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
  }

  deg2rad(deg) {
    return (deg * Math.PI) / 180;
  }

  rad2deg(rad) {
    return (rad * 180) / Math.PI;
  }

  valueChanged() {
    this.sharedService.push(true);
  }
}
