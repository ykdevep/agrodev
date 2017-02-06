import {Component, OnInit, ViewContainerRef} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {MdSnackBar} from '@angular/material';
import { MouseEvent } from "angular2-google-maps/core";
import { DialogsService } from '../dialog/dialogs.service';

import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';

import { Routes } from '../../../../both/collections/routes.collection';
import { GeoLocation } from '../../../../both/models/route.model';

import template from './route-form.component.html';

@Component({
  selector: 'route-form',
  template
})
export class RouteFormComponent implements OnInit {
  
  addForm: FormGroup;
  // Default center of mexico city.
  startRoute: GeoLocation = {
    name: "Start Route",
    lat: 19.433789301234,
    lng: -99.1351318359375
  }
  finalRoute: GeoLocation ={
    name: "Final Route",
    lat: 19.479193548305044,
    lng: -100.1571044921875
  }
  
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

    if (this.addForm.valid){

      MeteorObservable.call('insert_route',
            this.addForm.value.name,
            this.addForm.value.description,
            this.startRoute,
            this.finalRoute,
            this.addForm.value.price).subscribe(() => {
        this.snackBar.open(`Route successfully added!`, 'X', {duration: 1200});
      }, (error) => {
        this.snackBar.open(`Failed to insert route! ${error}`, 'X', {duration: 1200});
      });
      
      this.addForm.reset();
      this.snackBar.open('Route added!', 'X', {duration: 1200});
    }else{
      this.snackBar.open('Form have errors!', 'X', {duration: 1200});
    }
  }   

  markerDragEndStart($event: MouseEvent) {
      this.startRoute.lat = $event.coords.lat;
      this.startRoute.lng = $event.coords.lng;
  }

  markerDragEndFinal($event: MouseEvent) {
      this.finalRoute.lat = $event.coords.lat;
      this.finalRoute.lng = $event.coords.lng;
  }  
}