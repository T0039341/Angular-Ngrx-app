import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Rect } from '../tanks/rect';

@Component({
  selector: 'app-temp-canvas',
  templateUrl: './temp-canvas.component.html',
  styleUrls: ['./temp-canvas.component.scss']
})
export class TempCanvasComponent implements OnInit {
  @ViewChild('myCanvas') myCanvas: ElementRef;

  private _temperature: number = null;

  @Input()
  set temperature(temperature: number) {
    this._temperature = temperature;
    this.drawCanvas();
  }

  get temperature(): number {
    return this._temperature;
  }

  constructor() {}

  ngOnInit() {}

  drawCanvas() {
    const canvas = this.myCanvas.nativeElement;
    const parent = canvas.parentElement;
    console.log(
      'parent',
      parent,
      parent.style,
      parent.clientWidth,
      parent.clientHeight,
      parent.getBoundingClientRect()
    );

    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.

    const multiplier = 1;

    canvas.height = parent.clientHeight;
    canvas.width = canvas.height;

    const ctx = canvas.getContext('2d');

    const startAngle = 135;
    console.log('context!', ctx);
    const endAngle = startAngle + 270;

    const blueColor = '#56A4AD';
    const orangeColor = '#F7C42A';
    const redColor = '#DB5E26';

    const temperature = this.temperature;
    if (this.temperature == null) {
      return;
    }

    let currentColor = '';

    if (temperature < 10) {
      currentColor = blueColor;
    } else if (temperature < 40) {
      currentColor = orangeColor;
    } else if (temperature <= 50) {
      currentColor = redColor;
    }

    const minTemp = -20;
    const maxTemp = 50;

    const tempPercentage =
      ((temperature - minTemp) / (maxTemp - minTemp)) * 100;

    console.log('temper percentage', tempPercentage);
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Setup bounds.
    let side = canvas.width;
    if (canvas.height < canvas.width) {
      side = canvas.height;
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

    // find the center of the rect

    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;
    console.log('rect center', centerX, centerY);

    // Draw the initial Arc
    ctx.beginPath();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
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
    ctx.strokeStyle = currentColor;
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
    // get x position by adding the centerX of the circle

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
    ctx.fillStyle = currentColor;
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();

    ctx.textAlign = 'center';
    const textSize = this.clamp(
      (canvas.height / 8) * multiplier,
      20 * multiplier,
      30 * multiplier
    );
    ctx.font =
      textSize +
      // tslint:disable-next-line: max-line-length
      'px BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif';
    ctx.fillStyle = '#FFF';
    const doc = new DOMParser().parseFromString(
      this.temperature + '&deg;C',
      'text/html'
    );
    ctx.fillText(doc.documentElement.textContent, centerX, centerY);
  }

  deg2rad(deg: number) {
    return (deg * Math.PI) / 180;
  }

  rad2deg(rad: number) {
    return (rad * 180) / Math.PI;
  }

  clamp(num: number, min: number, max: number) {
    return num <= min ? min : num >= max ? max : num;
  }
}
