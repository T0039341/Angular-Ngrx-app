import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl
} from '@angular/forms';

import { TankService } from '../tank.service';
import { SharedServiceService } from '../../shared/shared.service';
import { Tank, Sensor } from '../tank';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MessageService } from '../../shared/message.service';
import { Message } from 'src/app/shared/message';

import { map, filter, startWith, pairwise } from 'rxjs/operators';

import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';

@Component({
  selector: 'app-add-edit-tank',
  templateUrl: './add-edit-tank.component.html',
  styleUrls: ['./add-edit-tank.component.scss']
})
export class AddEditComponent implements OnInit {
  tankForm: FormGroup;

  hourGroup;
  minuteGroup;

  hourmin;
  frequency: number;

  currentQueryParams = '';

  asYouType = new AsYouType('LB');

  errorMessage = '';

  valid: boolean;

  sim: string = '';

  isDropdownActive: false;

  getId = this.route.snapshot.paramMap.get('id');

  isEditing = false;

  frequencies = [
    { id: 0, update: 'Once Per Day' },
    { id: 1, update: 'Every 2 Hours' },
    { id: 2, update: 'Every 4 Hours' }
  ];

  minutesCounter = [
    { id: 0, minutes: 0 },
    { id: 1, minutes: 15 },
    { id: 2, minutes: 30 },
    { id: 3, minutes: 45 }
  ];

  tankShapes = [
    { id: 'rect', tank: 'Rectangular' },
    { id: 'h_cyl', tank: 'Cylinder (horizontal)' },
    { id: 'v_cyl', tank: 'Cylinder (vertical)' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private tankService: TankService,
    private sharedService: SharedServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.createForm();
    this.minuteGroup = this.tankForm.get('minutesCounter');
    this.hourGroup = this.tankForm.get('hours');
    this.hourmin = this.tankForm.get('hourmin');

    this.router.events
      .pipe(
        startWith(new NavigationEnd(0, '/', '/')),
        filter(e => e instanceof NavigationEnd),
        pairwise(),
        map(arr => arr[1] as NavigationEnd)
      )
      .subscribe(res => {
        console.log('ressss', res);
        if (this.router.url.startsWith('/main')) {
          const currentUrl = res.url;
          const components = this.router.url.split('?');

          console.log('the components', components);

          const segments = components[0].split('/').filter(val => val !== '');

          console.log('segments', segments);

          if (components.length > 1) {
            this.currentQueryParams = '?' + components[1];
          } else {
            this.currentQueryParams = '';
          }
        }
      });

    if (this.getId != null) {
      this.getTankById(this.getId);
    }
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
    // this.onTimeChange();
    // this.onMinute();
    // this.setUpdateFreq();
  }

  createForm() {
    this.tankForm = this.formBuilder.group({
      widthForm: ['0', Validators.required],
      lengthForm: ['0', Validators.required],
      heightForm: ['0', Validators.required],
      diameterForm: ['0', Validators.required],
      tankShape: ['', Validators.required],
      tankName: ['', Validators.required],
      sensorImei: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{15}$')]
      ],
      simNumber: ['', [Validators.required, this.simValidator]],
      apn: ['', Validators.required],
      apnUserName: [''],
      apnPassword: ['']
    });
  }

  addTank() {
    this.errorMessage = '';
    const tank = new Tank();
    tank.name = this.tankForm.get('tankName').value;
    tank.shape = this.tankForm.get('tankShape').value;
    tank.length = +this.tankForm.get('lengthForm').value;
    tank.width = +this.tankForm.get('widthForm').value;
    tank.height = +this.tankForm.get('heightForm').value;
    tank.diameter = +this.tankForm.get('diameterForm').value;
    tank.sensor = new Sensor();
    tank.sensor.sensor_id = this.tankForm.get('sensorImei').value;
    tank.sensor.sim_number = this.tankForm.get('simNumber').value;
    tank.sensor.apn = this.tankForm.get('apn').value;
    tank.sensor.apn_username = this.tankForm.get('apnUserName').value;
    tank.sensor.apn_password = this.tankForm.get('apnPassword').value;
    this.tankService.register(tank).subscribe(
      res => {
        this.messageService.push(
          new Message('Tank Added Successfully', Message.INFO)
        );

        if (!res.data.sensor.is_verified) {
          this.router.navigateByUrl(
            '/main/tanks/' +
              res.data.tank_id +
              '/verify' +
              this.currentQueryParams
          );
          return;
        }
        this.valueChanged();
        this.router.navigateByUrl('/main/tanks' + this.currentQueryParams);
        console.log('rrr', res);
      }
      // err => {
      //   this.errorMessage = err.error.detail;
      //   console.log('login error', err.error.detail);
      // }
    );
  }

  valueChanged() {
    this.sharedService.push(true);
  }

  // display errors in real time using getters

  get sensorImei() {
    return this.tankForm.get('sensorImei');
  }

  get simNumber() {
    return this.tankForm.get('simNumber');
  }

  get apn() {
    return this.tankForm.get('apn');
  }

  get apnUserName() {
    return this.tankForm.get('apnUserName');
  }

  get apnPassword() {
    return this.tankForm.get('apnPassword');
  }

  get tankName() {
    return this.tankForm.get('tankName');
  }

  get diameterForm() {
    return this.tankForm.get('diameterForm');
  }

  get heightForm() {
    return this.tankForm.get('heightForm');
  }

  get lengthForm() {
    return this.tankForm.get('lengthForm');
  }

  get widthForm() {
    return this.tankForm.get('widthForm');
  }

  get tankShape() {
    return this.tankForm.get('tankShape');
  }

  counter(i: number) {
    return new Array(i);
  }

  disableTank() {
    const disable = this.tankForm.get('sensorImei').disable();
  }

  public simValidator = (
    control: AbstractControl
  ): { [key: string]: any } | null => {
    this.sim = control.value;
    const phoneNumber = parsePhoneNumberFromString(control.value, 'LB');
    if (phoneNumber === undefined) {
      return { simError: control.value };
    }
    if (phoneNumber.isValid()) {
      this.sim = phoneNumber.format('E.164');
      console.log('E.164 phone number: ', phoneNumber.format('E.164'));
      console.log('phone number valid: ', phoneNumber.isValid());
      return null;
    }

    this.sim = null;

    console.log('phone number valid: ', phoneNumber.isValid());

    console.log('E.164 phone number: ', phoneNumber.format('E.164'));
    return { simError: control.value };
  };

  onSubmit() {
    const tank: Tank = new Tank();
    const tankId = this.route.snapshot.paramMap.get('id');
    if (tankId != null) {
      tank.tank_id = tankId;
      this.editTank(tank);
    } else {
      this.addTank();
    }
  }

  editTank(tank: Tank) {
    tank.name = this.tankForm.get('tankName').value;
    tank.shape = this.tankForm.get('tankShape').value;
    tank.length = +this.tankForm.get('lengthForm').value;
    tank.width = +this.tankForm.get('widthForm').value;
    tank.height = +this.tankForm.get('heightForm').value;
    tank.diameter = +this.tankForm.get('diameterForm').value;
    tank.sensor = new Sensor();
    tank.sensor.sensor_id = this.tankForm.get('sensorImei').value;
    tank.sensor.sim_number = this.tankForm.get('simNumber').value;
    tank.sensor.apn = this.tankForm.get('apn').value;
    tank.sensor.apn_username = this.tankForm.get('apnUserName').value;
    tank.sensor.apn_password = this.tankForm.get('apnPassword').value;
    this.tankService.editTank(tank).subscribe(
      res => {
        this.valueChanged();

        if (!res.data.sensor.is_verified) {
          this.router.navigateByUrl(
            '/main/tanks/' + this.getId + '/verify' + this.currentQueryParams
          );
          return;
        }
        this.messageService.push(
          new Message('Tank Edited Successfully', Message.INFO)
        );

        this.router.navigateByUrl('/main/tanks');
        console.log('rrr', res);
        this.sim = res.data.sensor.sim_number;
      },
      err => {
        this.errorMessage = err;
        console.log('login error', err);
      }
    );
  }

  getTankById(tankId) {
    this.tankService.getTankById(tankId).subscribe(res => {
      this.sensorImei.setValue(res.data.sensor.sensor_id);
      this.simNumber.setValue(res.data.sensor.sim_number);
      this.apn.setValue(res.data.sensor.apn);
      this.apnUserName.setValue(res.data.sensor.apn_username);
      this.apnPassword.setValue(res.data.sensor.apn_password);
      this.tankName.setValue(res.data.name);
      this.diameterForm.setValue(res.data.diameter);
      this.widthForm.setValue(res.data.width);
      this.heightForm.setValue(res.data.height);
      this.lengthForm.setValue(res.data.length);
      this.tankShape.setValue(res.data.shape);
      console.log('value', parseInt('' + res.data.sensor.logger_speed / 4, 10));

      this.valueChanged();
      console.log(res.data);
    });
  }
}
