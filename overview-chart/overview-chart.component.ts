import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as moment from 'moment';
import 'moment-timezone';

import { Chart } from 'chart.js';

import { Report } from '../tanks/report';
import { TankService } from '../tanks/tank.service';

@Component({
  selector: 'app-overview-chart',
  templateUrl: './overview-chart.component.html',
  styleUrls: ['./overview-chart.component.scss']
})
export class OverviewChartComponent implements OnInit {
  @ViewChild('chart') chartCanvas!: ElementRef;

  private _tankId: string = null;

  report: Report;

  @Input()
  set tankId(tankId: string) {
    this._tankId = tankId;

    if (tankId != null) {
      this.getLatestTankReport();
    }
  }

  get tankId(): string {
    return this._tankId;
  }

  constructor(private tankService: TankService) {}

  ngOnInit() {}

  getLatestTankReport() {
    this.tankService.getReports(this.tankId, 'day', 1, 1).subscribe(res => {
      this.report = res.data.results[0];

      this.setupChart(this.chartCanvas, this.report);
    });
  }

  private setupChart(chart: any, report: Report) {
    console.log('setting up chart %o with report %o', chart, report);

    chart = (chart as ElementRef).nativeElement;

    console.log('chart size ', chart.height, chart.width, chart);
    console.log(
      'CHART PARENT',
      chart.parentNode,
      window.getComputedStyle(chart.parentNode).getPropertyValue('width')
    );
    const data = report.measurements;
    const ctx = chart.getContext('2d');
    Chart.defaults.global.elements.line.borderWidth = 1;
    Chart.defaults.global.elements.line.borderColor = '#10272B55';
    Chart.defaults.global.elements.point.backgroundColor = '#10272B55';
    Chart.defaults.global.elements.point.borderWidth = 0.5;
    Chart.defaults.global.elements.point.radius = 2;
    Chart.defaults.global.elements.point.borderColor = '#10272B';
    Chart.defaults.global.elements.line.backgroundColor = '#4caab766';
    const chartSchema = {
      datasets: [
        {
          label: 'Volume (in Liters)',
          backgroundColor: '#4caab766',
          data: data.map(measurement => {
            return { x: measurement.created_at, y: measurement.volume };
          })
        }
      ]
    };

    moment.tz.setDefault('UTC');
    let timeUnit: string;
    let tooltipFormat: string;
    let timeMin: moment.Moment;
    let timeMax: moment.Moment;
    let timeUnitStepSize: number;
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

    const parentStyle = window.getComputedStyle(chart.parentNode.parentNode);
    const parentWidth = parseFloat(parentStyle.getPropertyValue('width'));
    const parentHeight = parseFloat(parentStyle.getPropertyValue('height'));

    console.log('parent widthh', parentWidth);

    const clientWidth = document.body.clientWidth;

    const config: any = { fontColor: '#EEE', maxTicksLimit: 4, autoSkip: true };

    if (clientWidth <= 768) {
      config.maxTicksLimit = 4;
      config.autoSkip = true;
    } else if (clientWidth <= 1024) {
      config.autoSkip = true;
    }

    chart = new Chart(ctx, {
      type: 'line',
      data: chartSchema,
      options: {
        maintainAspectRatio: false,
        legend: {
          labels: { fontColor: '#EEE' },
          onClick: (e: { stopPropagation: any }) => e.stopPropagation
        },
        elements: {
          point: {
            radius: 0
          },
          line: {
            borderWidth: 2,
            borderColor: '#DDEaF796'
          }
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
                zeroLineColor: '#666666'
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
                color: '#666666',
                zeroLineColor: '#666666'
              },
              ticks: {
                beginAtZero: true,
                min: 0,
                suggestedMax: report.volume,
                fontColor: '#EEE'
              }
            }
          ]
        }
      }
    });
  }
}
