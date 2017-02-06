import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';

import { Meteor } from 'meteor/meteor'; 
import { MeteorObservable } from 'meteor-rxjs';
import { InjectUser } from "angular2-meteor-accounts-ui";

import { MouseEvent } from "angular2-google-maps/core";
import { MdSnackBar } from '@angular/material';
import { DialogsService } from '../dialog/dialogs.service';

import { Products } from '../../../../both/collections/products.collection';
import { Images } from '../../../../both/collections/images.collection';
import { Product } from '../../../../both/models/product.model';

import template from './product-details.component.html';

@Component({
  selector: 'product-details',
  template
})

@InjectUser('user')
export class ProductDetailsComponent implements OnInit, OnDestroy {

    productId: string;
    paramsSub: Subscription;
    product: Product;
    productSub: Subscription;
    querySub: Subscription;
    imagesSub: Subscription;

    user: Meteor.User;

    // Default center mexico city.
    centerLat: number = 19.479193548305044;
    centerLng: number = -99.1571044921875;

    unitPrice: number;
    query = {page: 1, name: '', order: -1};
    
    constructor(private route: ActivatedRoute,
         private snackBar: MdSnackBar,
         private dialog: DialogsService,
         private viewContainerRef: ViewContainerRef)
    {}

    ngOnInit(){
        this.imagesSub = MeteorObservable.subscribe('images').subscribe();

        this.paramsSub = this.route.params
            .map(params => params['productId'])
            .subscribe(productId => {
                this.productId = productId
                
                if (this.productSub) {
                    this.productSub.unsubscribe();
                }

                this.productSub = MeteorObservable.subscribe('product', this.productId).subscribe(() => {
                    this.product = Products.findOne(this.productId);
                    this.unitPrice = this.product.unitPrice;
                });
            });
        this.querySub = this.route.queryParams
            .map(params => params)
            .subscribe(params => {
                this.query = {page: params["page"], name: params["name"], order: +params["order"]};
            });
    }

    get isOwner(): boolean {
        return this.product && this.user && this.user._id === this.product.signature.createdBy;
    }

    saveProduct() {        
        if (!Meteor.userId()) {
            this.dialog.alert("Alert", "Please log in to change this product?", false, this.viewContainerRef)
        return;
        }

        if (this.unitPrice != this.product.unitPrice){
            this.product.oldsPrice.push(this.unitPrice);
            this.unitPrice = this.product.unitPrice;
        }

        MeteorObservable.call('update_product', this.product).subscribe(() => {
            this.snackBar.open(`Product successfully updated!`, 'X', {duration: 1200});
        }, (error) => {
            this.snackBar.open(`Failed to update product! ${error}`, 'X', {duration: 1200});
        });        
    }

    ngOnDestroy(){
        this.paramsSub.unsubscribe();
        this.productSub.unsubscribe();
        this.querySub.unsubscribe();
        this.imagesSub.unsubscribe();
    }

    onImage(imageId: string){
        this.product.images.push(imageId);
        Products.update(this.product._id, {
            $set: {
                images: this.product.images,
            }
        });
        this.snackBar.open('Image uploaded', 'X', {duration: 1200});
    }

    get lat(): number {
        return this.product && this.product.location.lat;
    }    

    get lng(): number {
        return this.product && this.product.location.lng;
    }    

    mapClicked($event: MouseEvent) {
        this.product.location.lat = $event.coords.lat;
        this.product.location.lng = $event.coords.lng;
    }

    removeImage(imageId: string): void {
        this.dialog.confirm("Alert", "Are you sure to want delete this image?", this.viewContainerRef).subscribe(result => {
            if(result){
                let listImages = [];
                this.product.images.forEach(element => {
                    if (element != imageId){
                        listImages.push(element);
                    }
                });
                this.product.images = listImages;
                Products.update(this.product._id, {
                    $set: {
                        images: this.product.images,
                    }
                });
                Images.remove({_id: imageId});
                this.snackBar.open('Image deleted!', 'X', {duration: 1200});
            }
        });            
    }
}