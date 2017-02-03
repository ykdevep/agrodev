import {Component, OnInit, NgZone} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';

import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

import template from './signup.component.html';

@Component({
  selector: 'signup',
  template
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor(
    private snackbar: MdSnackBar,
    private router: Router, 
    private zone: NgZone,
    private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required], 
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
  }

  signup() {
    if (this.signupForm.valid) {
      let config = new MdSnackBarConfig();
      config.duration = 3000;
      Accounts.createUser({
          email: this.signupForm.value.email,
          password: this.signupForm.value.password,
          profile: {
            firstName: this.signupForm.value.firstName,
            lastName: this.signupForm.value.lastName,
          }
        }, (err) => {
          if (err) {
            this.zone.run(() => {
              this.snackbar.open(err, 'X', config);
            });
          } else {
            this.router.navigate(['/']);
          }
        });
    }
  }
}