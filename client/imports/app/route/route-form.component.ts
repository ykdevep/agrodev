import {Component, OnInit, ViewContainerRef} from '@angular/core';

import {MdSnackBar, MdSnackBarConfig} from '@angular/material';
import { DialogsService } from '../dialog/dialogs.service';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Meteor } from 'meteor/meteor';

import { Routes } from '../../../../both/collections/routes.collection';

import template from './route-form.component.html';

@Component({
  selector: 'route-form',
  template
})
export class RouteFormComponent implements OnInit {
  
  addForm: FormGroup;
  
  constructor(private formBuilder: FormBuilder,
     private snackBar: MdSnackBar,
     private dialog: DialogsService, 
     private viewContainerRef: ViewContainerRef) {}

  ngOnInit(){
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [],
      start_route: ['', Validators.required],
      final_route: ['', Validators.required],
      price: ['', Validators.required],
    })
  }

  /*
  *Route added with reactive form, user is log.
  */
  addRoute(): void {

    if(!Meteor.userId){
      this.dialog.alert("Alert", "Please log in to add route", false, this.viewContainerRef);
      return;
    }

    let config = new MdSnackBarConfig();
    config.duration = 3000;    

    if (this.addForm.valid){

      Routes.insert({
        name: this.addForm.value.name,
        description: this.addForm.value.description,
        startRoute: {
          name: this.addForm.value.start_route,
          lat: 19.479193548305044,
          lng: -100.3571044921875
        },
        finalRoute: {
          name: this.addForm.value.final_route,
          lat: 19.479193548305044,
          lng: -99.1571044921875
        },
        price: this.addForm.value.price,        
        owner: Meteor.userId()
      });
      
      this.addForm.reset();
      this.snackBar.open('Route added!', 'X', config);
    }else{
      this.snackBar.open('Form have errors!', 'X', config);
    }
  }
  
}

