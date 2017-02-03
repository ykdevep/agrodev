import { Component } from '@angular/core';

import { ShoppingCartService } from './services/shopping-cart.service';

import template from './app.component.html';
import {InjectUser} from "angular2-meteor-accounts-ui";

import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

@Component({
  selector: 'app',
  template
})

@InjectUser('user')
export class AppComponent {

  year: number;

  constructor(private shoppingCart: ShoppingCartService, private snackBar: MdSnackBar) {
    let date = new Date();
    this.year = date.getUTCFullYear();
  }

  /**
   * Log out function and destroy a purchase order
   */
  logout() {
    Meteor.logout();
    let config = new MdSnackBarConfig();
    config.duration = 3000;

    this.snackBar.open("Logout user", 'X', config)

    this.shoppingCart.destroyPurchaseOrder();
  }
}