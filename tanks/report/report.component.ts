import {
  Component,
  OnInit,
  ElementRef,
  AfterViewInit,
  Directive,
  Input,
  ViewChildren,
  QueryList,
  Pipe,
  HostListener
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';
import * as moment from 'moment';
import 'moment-timezone';

import { DatePipe } from '@angular/common';
import { SharedServiceService } from 'src/app/shared/shared.service';
import { TankService } from '../tank.service';
import { Report } from '../report';
import { Chart } from 'chart.js';

// tslint:disable-next-line: directive-selector
@Directive({ selector: 'chart' })
export class ChartDirective {
  @Input() data!: [any];
  @Input() index!: number;
  constructor(public el: ElementRef) {}
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  providers: [DatePipe]
})
export class ReportComponent implements OnInit, AfterViewInit {
  private static dayFormatter = 'hh:mm a';
  private static monthFormatter = 'EEE dd';
  private static yearFormatter = 'MMM';

  private static dayTransform = 'Hourly';
  private static monthTransform = 'Daily';
  private static yearTransform = 'Monthly';

  modeGroup: FormGroup;
  @ViewChildren(ChartDirective) charts!: QueryList<ChartDirective>;
  public refChart: ElementRef;
  chart: any;
  hourmin;

  displayTank: [Report];
  tankVolume: number;

  pageNumber: number;
  currentTankPage: number;
  currentReportPage: number;
  totalReportPages = 1;

  isModalVisible: boolean;
  selectedReport: Report;

  isChartsLoaded: boolean;

  currentP: number;
  nextP?: number[] = null;
  previousP?: number[] = null;
  finalP?: number = null;
  initialP?: number = null;

  id = this.route.snapshot.paramMap.get('id');

  private currentTransformer = ReportComponent.dayTransform;
  private currentFormatter = ReportComponent.dayFormatter;

  modeDropDown = [
    { id: 0, mode: 'Daily' },
    { id: 1, mode: 'Monthly' },
    { id: 2, mode: 'Annually' }
  ];

  modeString: string;
  // mode = this.modeDropDown[].mode;

  constructor(
    private tankService: TankService,
    private route: ActivatedRoute,
    private sharedService: SharedServiceService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.chart = {};
  }

  ngOnInit() {
    this.createForm();
    this.getTank();
    this.onTimeChange();

    this.route.queryParamMap.subscribe(params => {
      const tankPageStr = params.get('page');
      console.log('tankPageStr', tankPageStr);
      if (tankPageStr !== '') {
        this.currentTankPage = parseInt(tankPageStr, 10);
      }

      const reportPageStr = params.get('report_page');
      if (reportPageStr !== '') {
        this.currentReportPage = parseInt(reportPageStr, 10);
      }
    });
    if (this.route.snapshot.queryParamMap.get('page') === '') {
      this.currentP = 1;
    } else {
      this.currentP = +this.route.snapshot.queryParamMap.get('page');
    }
    this.onPaginationChange();
  }

  createForm() {
    this.modeGroup = this.formBuilder.group({
      modeDropDown: ['Daily']
    });
  }

  // <!-- <div class="is-fullheight is-flex is-wrapper">
  //   <div class="box is-fullheight"></div>
  // </div> -->

  onTimeChange() {
    this.modeGroup
      .get('modeDropDown')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe(selectedMode => {
        console.log('selected mode', selectedMode);
        switch (selectedMode) {
          case this.modeDropDown[0].mode:
            this.currentFormatter = ReportComponent.dayFormatter;
            this.currentTransformer = ReportComponent.dayTransform;
            break;
          case this.modeDropDown[1].mode:
            this.currentFormatter = ReportComponent.monthFormatter;
            this.currentTransformer = ReportComponent.monthTransform;

            break;
          case this.modeDropDown[2].mode:
            this.currentFormatter = ReportComponent.yearFormatter;
            this.currentTransformer = ReportComponent.yearTransform;

            break;
        }
        console.log('erwrewr', this.currentTransformer);

        this.currentReportPage = 1;
        this.getTankReports();
      });
  }

  ngAfterViewInit() {
    // listen to changes
    this.charts.changes.subscribe(r => {
      console.log(r, this.isChartsLoaded);
      r.toArray().forEach(child => {
        console.log(child);
        console.log(child.el.nativeElement.childNodes[0]);
        const chart = child.el.nativeElement.childNodes[0];

        if (chart.nodeName !== 'CANVAS') {
          return;
        }

        this.setupChart(chart, child.data);
      });
    });
  }

  paramId() {
    return this.route.snapshot.paramMap.get('id');
  }

  paramMode() {
    if (this.modeGroup.get('modeDropDown').value === '') {
      this.modeString = 'Day';
      return 'day';
    } else if (this.modeGroup.get('modeDropDown').value === 'Daily') {
      this.modeString = 'Day';
      return 'day';
    } else if (this.modeGroup.get('modeDropDown').value === 'Monthly') {
      this.modeString = 'Month';
      return 'month';
    } else if (this.modeGroup.get('modeDropDown').value === 'Annually') {
      this.modeString = 'Year';
      return 'year';
    }
  }

  getTankReports(page: number = 1) {
    this.tankService
      .getReports(this.paramId(), this.paramMode(), this.currentReportPage || 1)
      .subscribe(res => {
        this.valueChanged();
        this.paginationOrganizer(res.data.page, res.data.total_pages);
        this.pageNumber = res.data.page;
        this.displayTank = res.data.results;
        this.currentReportPage = res.data.page;
        // update url
        this.totalReportPages = res.data.total_pages;
        console.log('show 1 tank', this.displayTank[0]);
        console.log('display tnakz', this.displayTank);

        console.log(this.paramMode());
      });
  }

  // displaying events

  displayEvents(index: number) {
    this.selectedReport = this.displayTank[index];
    console.log(this.selectedReport);
    console.log('selected reports', this.selectedReport.events.length);
    console.log('selected report mode', this.selectedReport.mode);
    this.isModalVisible = true;
  }

  private getTank() {
    this.tankService.getTankById(this.paramId()).subscribe(res => {
      this.tankVolume = (+parseInt('' + res.data.volume / 10, 10) + 1) * 10;
      this.getTankReports();
    });
  }

  paginationOrganizer(tankpage: number, pages: number) {
    this.initialP = null;
    this.finalP = null;
    this.previousP = null;
    this.nextP = null;
    this.currentP = tankpage;

    if (tankpage > 1) {
      this.initialP = 1;
    }

    if (tankpage < pages) {
      this.finalP = pages;
    }

    if (this.initialP != null && this.currentP - this.initialP > 1) {
      console.log('rere', this.currentP - this.initialP);
      this.previousP = Array(1).fill(tankpage - 1);
    } else {
      this.previousP = null;
      console.log('elseprevious', this.previousP);
    }

    if (this.finalP - tankpage > 1) {
      this.nextP = Array(1).fill(tankpage + 1);
    } else {
      this.nextP = null;
    }
  }

  onPaginationChange() {
    // this.getTankReports(this.pageNumber);
    this.route.queryParamMap.subscribe(url => {
      console.log(+url.get('page'), 'calling gettankreports');
      this.getTankReports(+url.get('page'));
    });
  }

  // @HostListener('document:keydown.escape', ['$event'])
  // handleEscapeEvent(event: KeyboardEvent) {
  //   // if (event.keyCode === 27) {
  //   this.isModalVisible = false;
  //   // }
  // }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeEvent(event: KeyboardEvent) {
    // if (event.keyCode === 27) {
    this.isModalVisible = false;
    // }
  }

  checkPageLimit() {
    if (this.currentP < 1) {
      this.currentP = 1;
    } else if (this.currentP > this.finalP) {
      this.currentP = this.finalP;
    }
  }

  private setupChart(chart: any, report: Report) {
    if ((chart as ElementRef).nativeElement as HTMLElement) {
      return;
    }
    console.log('chart size ', chart.height, chart.width, chart);
    console.log(window.getComputedStyle(chart, null).getPropertyValue('width'));
    console.log(
      'CHART PARENT',
      chart.parentNode,
      window.getComputedStyle(chart.parentNode).getPropertyValue('width')
    );
    const data = report.measurements;
    const ctx = chart.getContext('2d');
    Chart.defaults.global.elements.line.borderWidth = 1;
    Chart.defaults.global.elements.line.borderColor = '#10272B55';
    // Chart.defaults.global.elements.point.backgroundColor = '#10272B55';
    Chart.defaults.global.elements.point.borderWidth = 0.5;
    Chart.defaults.global.elements.point.radius = 2;
    Chart.defaults.global.elements.point.borderColor = '#10272B';
    Chart.defaults.global.elements.line.backgroundColor = '#4caab766';

    // ctx.fillStyle = chart.config.options.chartArea.backgroundColor;

    const chartSchema = {
      datasets: [
        {
          // background for the graph's internal area
          label: 'Volume (in Liters)',
          // fontColor: '#eeeeee',
          backgroundColor: '#4caab766',
          data: data.map(measurement => {
            return { x: measurement.created_at, y: measurement.volume };
          })
        }
      ]
    };

    moment.tz.setDefault('UTC');
    let timeUnit;
    let tooltipFormat;
    let timeMin;
    let timeMax;
    let timeUnitStepSize;
    switch (report.mode) {
      case 'day':
        timeUnit = 'minute';
        tooltipFormat = 'hh:mm A';
        timeMin = moment.utc(report.created_at).startOf('day');
        timeMax = moment
          .utc(report.created_at)
          .add(1, 'day')
          .startOf('day');
        timeUnitStepSize = 60;
        break;
      case 'month':
        timeUnit = 'day';
        tooltipFormat = 'ddd MMM Do';
        timeMin = moment.utc(report.created_at).startOf('month');
        timeMax = moment.utc(report.created_at).endOf('month');
        timeUnitStepSize = 1;
        break;
      case 'year':
        timeUnit = 'month';
        tooltipFormat = 'MMMM YYYY';
        timeMin = moment.utc(report.created_at).startOf('year');
        timeMax = moment
          .utc(report.created_at)
          .endOf('year')
          .add(1, 's');
        timeUnitStepSize = 1;
        break;
    }

    const parentStyle = window.getComputedStyle(chart.parentNode);
    const parentWidth = parentStyle.getPropertyValue('width');
    console.log('parent widthh', parentWidth);

    const clientWidth = document.body.clientWidth;

    const config: any = {
      fontColor: '#eeeeee ',
      maxTicksLimit: 4,
      autoSkip: true
    };
    let aspectRatio = 2;

    if (clientWidth <= 768) {
      aspectRatio = 1;
      config.maxTicksLimit = 4;
      config.autoSkip = true;
    }

    chart = new Chart(ctx, {
      type: 'line',
      data: chartSchema,
      options: {
        responsive: true,
        // aspectRatio: aspectRatio,
        legend: {
          labels: { fillColor: '#EEE', fontColor: '#eeeeee' },
          onClick: e => e.stopPropagation
        },
        elements: {
          point: {
            pointStyle: 'crossRot',
            radius: 4,
            rotation: 0,
            borderWidth: 1,
            hoverRadius: 6,
            hoverBorderWidth: 9,

            borderColor: '#eeeeee',
            backgroundColor: 'blue'
          }

          // line on top
          // line: {
          //   borderWidth: 2,
          //   borderColor: '#DDEaF796'
          // }
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: true,
                color: '#808080',
                zeroLineColor: '#eeeeee'
              },

              type: 'time',
              distribution: 'linear',
              ticks: config,
              time: {
                displayFormats: {
                  minute: 'hh:mm A',
                  day: 'MMM DD',
                  month: 'MMM'
                },

                unit: timeUnit,
                min: timeMin,
                max: timeMax,
                tooltipFormat: tooltipFormat,
                unitStepSize: timeUnitStepSize
              }
            }
          ],
          yAxes: [
            {
              gridLines: {
                display: true,
                color: '#808080',
                zeroLineColor: '#eeeeee'
              },
              ticks: {
                // max: this.tankVolume > 0 ? this.tankVolume : undefined,
                beginAtZero: true,
                suggestedMax: report.volume,
                fontColor: '#eeeeee'
              }
            }
          ]
        },

        pan: {
          enabled: true,
          mode: 'xy',
          speed: 10,
          threshold: 5
        }
        // zoom: {
        //   enabled: true,
        //   drag: false,
        //   mode: 'xy',
        //   limits: {
        //     max: 10,
        //     min: 0.5
        //   }
        // }
      }
    });
  }

  selected() {
    console.log(this.modeGroup);
  }

  valueChanged() {
    this.sharedService.push(true);
  }
}
