import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {MdSnackBar, MdSnackBarConfig} from '@angular/material';
import { DialogsService } from '../dialog/dialogs.service';

import { Meteor } from 'meteor/meteor';
import { Products } from '../../../../both/collections/products.collection';

import template from './product-form.component.html';

@Component({
  selector: 'product-form',
  template
})

export class ProductFormComponent implements OnInit {

  addForm: FormGroup;
  images: string[] = []; 
  
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

    let config = new MdSnackBarConfig();
    config.duration = 3000;
    
    if (this.addForm.valid){
      Products.insert({
        name: this.addForm.value.name,
        description: this.addForm.value.description,
        location: {
          name: this.addForm.value.location,
          lat: 19.479193548305044,
          lng: -99.1571044921875
        },
        onSale: this.addForm.value.on_sale,
        quantityInStock: this.addForm.value.quantity_in_stock,
        unitPrice: this.addForm.value.unit_price,
        oldPrice: null,
        images: this.images,
        popularity: 0,
        owner: Meteor.userId()
      });
      
      this.addForm.reset();
      this.images = [];
      this.snackBar.open('Product added!', 'X', config);
    }else{
      this.snackBar.open('Form have errors!', 'X', config);
    }
  }

  onImage(imageId: string){
    this.images.push(imageId);
  }
}