import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {MdSnackBar} from '@angular/material';
import { DialogsService } from '../dialog/dialogs.service';

import { MouseEvent } from "angular2-google-maps/core";

import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';

import { Products } from '../../../../both/collections/products.collection';
import { GeoLocation } from '../../../../both/models/product.model';

import template from './product-form.component.html';

@Component({
  selector: 'product-form',
  template
})

export class ProductFormComponent implements OnInit {

  addForm: FormGroup;
  images: string[] = [];
  // Default center of mexico city.
  location: GeoLocation = {
    name: "Start Route",
    lat: 19.433789301234,
    lng: -99.1351318359375
  } 
  
  constructor(private formBuilder: FormBuilder,
     private snackBar: MdSnackBar,
     private dialog: DialogsService, 
     private viewContainerRef: ViewContainerRef) {}

  ngOnInit(){
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      quantity_in_stock: ['', Validators.required],
      unit_price: ['', Validators.required],
      on_sale: [true, Validators.required],  
    });
  }

  /*
  *Product added with reactive form, user is log.
  */
  addProduct(): void {    

    if(!Meteor.userId){
      this.dialog.alert("Alert", "Please log in to add product", false, this.viewContainerRef);
      return;
    }    

    if (this.addForm.valid){  

      MeteorObservable.call('insert_product',
            this.addForm.value.name,
            this.addForm.value.description,
            this.location,
            this.addForm.value.on_sale,
            this.addForm.value.quantity_in_stock,
            this.addForm.value.unit_price,
            this.images)
      .subscribe(() => {
        this.snackBar.open(`Product successfully added!`, 'X', {duration: 1200});
      }, (error) => {
        this.snackBar.open(`Failed to insert product! ${error}`, 'X', {duration: 1200});
      });
      
      this.addForm.reset();
      this.images = [];
    }else{
      this.snackBar.open('Form have errors!', 'X', {duration: 1200});
    }
  }

  onImage(imageId: string){
    this.images.push(imageId);
  }

  get lat(): number {
    return this.location.lat;
  }    

  get lng(): number {
    return this.location.lng;
  }    

  mapClicked($event: MouseEvent) {
    this.location.lat = $event.coords.lat;
    this.location.lng = $event.coords.lng;
  }
}