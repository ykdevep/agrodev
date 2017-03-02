import {Component, OnInit, NgZone} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';

import { MdSnackBar } from '@angular/material';
import { Translation, TranslationService } from 'angular-l10n';

import template from './recover.component.html';

@Component({
  selector: 'recover',
  template
})
export class RecoverComponent extends Translation implements OnInit {
  recoverForm: FormGroup;

  constructor(
    private snackbar: MdSnackBar,
    private router: Router,
    private zone: NgZone,
    private formBuilder: FormBuilder,
    public translation: TranslationService) {      
        super(translation);    
    }

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