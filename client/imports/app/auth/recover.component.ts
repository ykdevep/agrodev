import {Component, OnInit, NgZone} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';

import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

import template from './recover.component.html';

@Component({
  selector: 'recover',
  template
})
export class RecoverComponent implements OnInit {
  recoverForm: FormGroup;

  constructor(
    private snackbar: MdSnackBar,
    private router: Router,
    private zone: NgZone,
    private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.recoverForm = this.formBuilder.group({
      email: ['', Validators.required]
    });
  }

  recover() {
    if (this.recoverForm.valid) {
      Accounts.forgotPassword({
        email: this.recoverForm.value.email
      }, (err) => {
        if (err) {
          let config = new MdSnackBarConfig();
          config.duration = 3000;
          this.zone.run(() => {
            this.snackbar.open(err, "X", config);
          });
        } else {
          this.router.navigate(['/']);
        }
      });
    }
  }
}