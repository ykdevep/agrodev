import {Component, OnInit, NgZone} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

import template from './login.component.html';

@Component({
  selector: 'login',
  template
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  
  constructor(
    private snackbar: MdSnackBar,
    private router: Router,
    private zone: NgZone,
    private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    
  }

  login() {
    if (this.loginForm.valid) {
      Meteor.loginWithPassword(this.loginForm.value.email, this.loginForm.value.password, (err) => {
        let config = new MdSnackBarConfig();
        config.duration = 3000;
        if (err) {
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