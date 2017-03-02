import {Component, OnInit, NgZone} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Translation, TranslationService } from 'angular-l10n';
import { Meteor } from 'meteor/meteor';

import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

import template from './login.component.html';

@Component({
  selector: 'login',
  template
})
export class LoginComponent extends Translation implements OnInit {
  loginForm: FormGroup;
  
  constructor(
    private snackbar: MdSnackBar,
    private router: Router,
    private zone: NgZone,
    private formBuilder: FormBuilder,
    public translation: TranslationService) {      
        super(translation);    
    }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    
  }

  login() {
    if (this.loginForm.valid) {
      Meteor.loginWithPassword(this.loginForm.value.email, this.loginForm.value.password, (err) => {
        if (err) {
          this.zone.run(() => {
            this.snackbar.open(err, "X", {duration: 1200});
          });
        } else {
          this.router.navigate(['/']);
        }
      });
    }
  }
}