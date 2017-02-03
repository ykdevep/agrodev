import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {MdSnackBar, MdSnackBarConfig} from '@angular/material';
import { ShoppingCartService } from '../services/shopping-cart.service';

import { Meteor } from 'meteor/meteor'; 
import { InjectUser } from "angular2-meteor-accounts-ui";

import { Product } from '../../../../both/models/product.model'; 

import template from './purchase-order.component.html';

enum Status	{submitted, shipped, received, returned};

@Component({
  selector: 'purchase-order',
  template
})

@InjectUser('user')
export class PurchaseComponent implements OnInit {

  private flag: boolean = false;
  private purchaseForm: FormGroup;
  private user: Meteor.User;

  constructor(
    private snackBar: MdSnackBar,
    private formBuilder: FormBuilder,
    private shoppingCart: ShoppingCartService) {}

  /**
   * 
   */
  ngOnInit(){
    this.purchaseForm = this.formBuilder.group({
      shippingAddress: ['', Validators.required],
      shippingCity: ['', Validators.required],
      shippingZip: ['', Validators.required],
      shippingState: ['', Validators.required],
      shippingCountry: ['', Validators.required],
    });    
  }

  /**
   * Purchase order
   */
  purchase(): void {
    
    if (this.purchaseForm.valid){
      this.shoppingCart.updatePurchaseOrder(this.purchaseForm.value.shippingAddress, this.purchaseForm.value.shippingCity, this.purchaseForm.value.shippingZip, this.purchaseForm.value.shippingState, this.purchaseForm.value.shippingCountry, Status.shipped, this.user._id)
      this.snackBar.open('Purchase order shipped!', 'X', {duration: 1200});
      this.flag = false;

      this.purchaseForm.reset();
      
      if (this.user){
        this.shoppingCart.initPurchaseOrder(this.user._id);
        this.shoppingCart.destroyPurchaseOrder();
      } else {
        this.snackBar.open('Log in user', 'X', {duration: 1200});
      }      
    } else {
      this.snackBar.open('Purchase form not valid', 'X', {duration: 1200});
    }
  }

  /**
   * Purchase button
   */
  purchaseButton(): void{
    this.flag = true;
  }

  /**
   * Remove item of shopping cart
   */
  removeItem(product: Product): void {
    this.shoppingCart.removePurchaseItem(product);
    this.snackBar.open('Product removed!', 'X', {duration: 1200});
  }
}