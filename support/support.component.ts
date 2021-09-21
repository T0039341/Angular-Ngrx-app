import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from '../shared/message.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {
  fieldForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService
  ) {}

  countrySelector = [
    { id: 0, country: 'Leb' },
    { id: 1, country: 'US' },
    { id: 2, country: 'UK' },
    { id: 3, country: 'UAE' },
    { id: 4, country: 'KSA' }
  ];

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.fieldForm = this.formBuilder.group({
      emailForm: ['', Validators.required],
      phoneForm: ['', Validators.required],
      messageForm: ['', Validators.required],
      name: ['', Validators.required],
      countryDropdown: ['']
    });
  }

  onSubmit() {
    this.route.navigateByUrl('/main/tanks');
    console.log('succeeded');
  }

  get emailForm() {
    return this.fieldForm.get('emailForm');
  }

  get phoneForm() {
    return this.fieldForm.get('phoneForm');
  }

  get messageForm() {
    return this.fieldForm.get('messageForm');
  }

  get countryDropdown() {
    return this.fieldForm.get('countryDropdown');
  }
}
