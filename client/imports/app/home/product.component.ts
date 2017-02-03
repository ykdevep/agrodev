import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Meteor } from 'meteor/meteor'; 
import { MeteorObservable } from 'meteor-rxjs';
import { InjectUser } from "angular2-meteor-accounts-ui";

import { MouseEvent } from "angular2-google-maps/core";

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';

import { Products } from '../../../../both/collections/products.collection';
import { Images } from '../../../../both/collections/images.collection';
import { Product } from '../../../../both/models/product.model';

import {MdSnackBar, MdSnackBarConfig} from '@angular/material';
import { DialogsService } from '../dialog/dialogs.service';
import { ShoppingCartService } from '../services/shopping-cart.service';

import template from './product.component.html';

@Component({
  selector: 'product',
  template
})

@InjectUser('user')
export class ProductComponent implements OnInit, OnDestroy {

    productId: string;    
    query: Object = {};

    paramsSub: Subscription;
    querySub: Subscription;

    product: Product;
    productSub: Subscription;

    imagesSub: Subscription;
    //thumbsSub: Subscription;

    user: Meteor.User;
    // Default center Palo Alto coordinates.
    centerLat: number = 37.4292;
    centerLng: number = -122.1381;
    
    constructor(
        private route: ActivatedRoute,
        private snackBar: MdSnackBar,
        private dialog: DialogsService,
        private shoppingCart: ShoppingCartService,
        private viewContainerRef: ViewContainerRef) {}

    ngOnInit(){
        this.imagesSub = MeteorObservable.subscribe('images').subscribe();
       // this.thumbsSub = MeteorObservable.subscribe('thumbs').subscribe();

        this.paramsSub = this.route.params
            .map(params => params)
            .subscribe(params => {
                this.productId = params["productId"];
                                
                if (this.productSub) {
                    this.productSub.unsubscribe();
                }

                this.productSub = MeteorObservable.subscribe('details', this.productId).subscribe(() => {
                    this.product = Products.findOne(this.productId);
                });
            });
        
        this.querySub = this.route.queryParams
            .map(params => params)
            .subscribe(params => {
                this.query = {page: params["page"], name: params["name"], max: params["max"], min: params["min"]};
            });
    }

    get isOwner(): boolean {
        return this.product && this.user && this.user._id === this.product.owner;
    }

    /**
   * Adding producto to shopping cart
   */
  addCart(): void{
        
    if (!this.user){
      this.dialog.alert("Alert", "Please log in to purchase", true, this.viewContainerRef);
    }else{

      let config = new MdSnackBarConfig();
      config.duration = 5000;

      if (this.productSub){
          this.productSub.unsubscribe();
      }

      this.productSub = MeteorObservable.subscribe('productExitsInStock', this.product._id).subscribe(() => {
        this.product = Products.findOne(this.product._id);

        if (this.product.quantityInStock > 0){
          this.shoppingCart.addPurchaseItem(this.product, this.user._id);
          this.snackBar.open('Adding Product to shopping cart...', 'X', config);
        } else {
          this.snackBar.open('Quantity in stock is zero.', 'X', config);
        }
      });      
    }        
  }

    ngOnDestroy(){
        this.paramsSub.unsubscribe();
        this.querySub.unsubscribe();
        this.productSub.unsubscribe();
        this.imagesSub.unsubscribe();
       // this.thumbsSub.unsubscribe();
    }

    get lat(): number {
        return this.product && this.product.location.lat;
    }    

    get lng(): number {
        return this.product && this.product.location.lng;
    }  
}