import { Component, OnInit } from '@angular/core';
import { TankService } from '../tanks/tank.service';
import {
  ActivatedRoute,
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationExtras
} from '@angular/router';
import { Message } from '../shared/message';
import { MessageService } from '../shared/message.service';
import { SharedServiceService } from '../shared/shared.service';
import { Tank } from '../tanks/tank';
import { map, filter, startWith, pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  myData: any[];
  alltanks: any[];
  tanklist: any;

  currentPage: number;
  nextpages?: number[] = null;
  previouspages?: number[] = null;
  finalpage?: number = null;
  initialPage?: number = null;

  selectedTankId = this.route.snapshot.queryParamMap.get('id');

  isAddingTank: boolean;

  totalTanksPage = 1;

  selectedTankIndex: any;

  isDeleteModalVisible: boolean;

  currentUrl: string;
  currentPath: string;
  currentQueryParams = '';
  currentTankId: string;
  currentTankPage: number;
  currentReportPage: number;
  currentReportMode: string;

  constructor(
    private tankService: TankService,
    private route: ActivatedRoute,
    private router: Router,

    private messageService: MessageService,
    private sharedService: SharedServiceService
  ) {
    this.router.events
      .pipe(
        startWith(new NavigationEnd(0, '/', '/')),
        filter(e => e instanceof NavigationEnd),
        pairwise(),
        map(arr => arr[1] as NavigationEnd)
      )
      .subscribe(res => {
        // Update navigation item selection.
        console.log('on tanks');
        if (this.router.url.startsWith('/main')) {
          this.currentUrl = res.url;
          const components = this.router.url.split('?');

          console.log('the components', components);

          const segments = components[0].split('/').filter(val => val !== '');

          console.log('segments', segments);

          const lastSegment = segments[segments.length - 1];

          if (
            segments.length > 2 &&
            segments[1] === 'tanks' &&
            segments[2] !== 'add'
          ) {
            this.currentTankId = segments[2];
          } else {
            this.currentTankId = '';
          }

          if (segments.length > 2 && segments[2] === 'add') {
            this.isAddingTank = true;
          } else {
            this.isAddingTank = false;
          }

          this.currentPath = components[0];

          if (components.length >= 2) {
            this.currentQueryParams = `?${components[1]}`;
          }

          // this.getTanks(this.currentPage);
        }

        // default:
      });
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const tankPageStr = params.get('page');
      console.log('tankPageStr', tankPageStr);
      if (tankPageStr !== '' && tankPageStr != null) {
        this.currentTankPage = parseInt(tankPageStr, 10);
      }

      const reportPageStr = params.get('report_page');
      if (reportPageStr !== '') {
        this.currentReportPage = parseInt(reportPageStr, 10);
      }

      const reportModeStr = params.get('mode');
      if (reportModeStr !== '') {
        this.currentReportMode = reportModeStr;
      }

      this.getTanks(this.currentTankPage || 1);
    });
    console.log(this.currentTankId);
  }

  getTanks(page: number = 1) {
    this.tankService.getTanks(page, 2).subscribe(res => {
      this.alltanks = res.data.results;
      this.currentPage = res.data.page;
      this.totalTanksPage = res.data.total_pages;

      this.paginationOrganizer(res.data.page, res.data.total_pages);
      console.log(this.alltanks);
      this.sharedService.push({
        type: 'LoadTanksEvent',
        data: { numberOfTanks: this.alltanks.length }
      });
    });
  }

  showDetails(tank: any) {
    console.log('showing tank details', this.currentQueryParams);
    this.router.navigateByUrl(
      `/main/tanks/${tank.tank_id}${this.currentQueryParams}`
    );
  }

  deleteTankClicked() {
    if (this.currentPath.endsWith('/verify')) {
      console.log('path Length ', this.currentPath.length);

      this.messageService.push(
        new Message('Please finish verification or cancel', Message.INFO)
      );
      console.log('currentPath', this.currentPath);
      console.log('stopppp');
      return;
    } else {
      this.isDeleteModalVisible = true;
    }
  }

  deleteTank() {
    // console.log('this.selected', this.selectedTankId, this.selectedTankIndex);
    this.isDeleteModalVisible = false;
    this.tankService.deleteTank(this.currentTankId).subscribe(res => {
      this.alltanks.splice(this.selectedTankIndex, 1);
      console.log('current path', this.currentPath);
      this.messageService.push(
        new Message('Tank Deleted Successfully!', Message.INFO)
      );

      const navigationExtras: NavigationExtras = {
        queryParamsHandling: 'merge',
        // preserveFragment: true,
        replaceUrl: true
      };

      this.router.navigate(['/main/tanks'], navigationExtras);
    });
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

  onCancelClicked() {}
}
