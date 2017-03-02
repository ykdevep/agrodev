import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Translation, TranslationService } from 'angular-l10n';

import { Meteor } from 'meteor/meteor'; 
import { MeteorObservable } from 'meteor-rxjs';
import { InjectUser } from "angular2-meteor-accounts-ui";
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/debounce';

import {MdSnackBar, MdSnackBarConfig} from '@angular/material';
import { DialogsService } from '../dialog/dialogs.service';
import { ShoppingCartService } from '../services/shoppingCart.service';

import { Products } from '../../../../both/collections/products.collection';
import { Product } from '../../../../both/models/product.model'; 
import { Images } from '../../../../both/collections/images.collection';
import { Thumbs } from '../../../../both/collections/images.collection';

import template from './home.component.html';
import style from './home.component.scss';

interface Pagination {
  limit: number;
}

interface Options extends Pagination {
  [key: string]: any;
}

@Component({
  selector: 'home',
  template,
  styles: [style]
})

@InjectUser('user')
export class HomeComponent extends Translation implements OnInit, OnDestroy {
  isLoading = true;
  searchForm: FormGroup;

  products: Observable<Product[]>; 
  productsSub: Subscription;
  productSub: Subscription;
  thumbsSub: Subscription;
  
  pageSize: Subject<number> = new Subject<number>();
  curPage: Subject<number> = new Subject<number>();
  optionsSub: Subscription;
  querySub: Subscription;
  productsSize: number = 0;
  autorunSub: Subscription;

  name: Subject<string> = new Subject<string>();
  min: Subject<number> = new Subject<number>();
  max: Subject<number> = new Subject<number>();

  query = {page: 1, name: '', min: undefined, max: undefined};

  user: Meteor.User;
  
  cont: number = 50;
  page: number = 1;
    
  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private snackBar: MdSnackBar,
    private dialog: DialogsService,
    private shoppingCart: ShoppingCartService,
    private viewContainerRef: ViewContainerRef,
    public translation: TranslationService) {      
        super(translation);    
    }

  ngOnInit() {
    this.thumbsSub = MeteorObservable.subscribe('thumb').subscribe();

    this.optionsSub = Observable.combineLatest(
      this.pageSize,
      this.curPage,
      this.name,
      this.min,
      this.max
    ).subscribe(([pageSize, curPage, name, min, max]) => {
      const options: Options = {
        limit: (pageSize as number) * (curPage as number),
        order: {createdAt: -1}
      };

      this.query = {page: curPage, name: name, min: min, max: max};
      
      if (this.productsSub) {
        this.productsSub.unsubscribe();
      }      

      this.productsSub = MeteorObservable.subscribe('home', options, name, min, max).subscribe(() => {
        this.products = Products.find({}, {}).zone(); 
        this.isLoading = false;
        if (this.user){
          this.shoppingCart.initPurchaseOrder(this.user._id);
        }        
      });      
    });

    this.querySub = this.route.queryParams
        .map(params => params)
        .subscribe(params => {
          
          if (params["page"]){
            this.page = +params["page"];
            this.pageSize.next(this.cont);
            this.curPage.next(this.page);
            this.name.next(params["name"]);
            (isNaN(params["max"])) ? this.max.next() : this.max.next(+params["max"]);           
            (isNaN(params["min"])) ? this.min.next() : this.min.next(+params["min"]);            
          }else{
            this.pageSize.next(this.cont);
            this.curPage.next(this.page);
            this.name.next('');
            this.max.next();
            this.min.next();
          }
        });  
    
    this.searchForm = this.formBuilder.group({
      name: [this.query.name],
      min: [this.query.min],
      max: [this.query.max],
    });
    
    this.autorunSub = MeteorObservable.autorun().subscribe(() => {
      this.productsSize = Counts.get('numberOfProducts');
    });    
  }

  search(): void {
    
    if (this.searchForm.valid){
      this.page = 1;
      this.curPage.next(this.page);
      this.name.next(this.searchForm.value.name);
      if (this.searchForm.value.min){
        this.min.next(this.searchForm.value.min);
      }else {
        this.min.next();
      }
      
      if (this.searchForm.value.max){
        this.max.next(this.searchForm.value.max);
      }else{
        this.max.next();
      }      
      this.snackBar.open('Searching...', 'X', {duration: 1200});     
    }else{
      this.snackBar.open('Form have errors!', 'X', {duration: 1200});
    }    
  }

  onPageChanged(page: number): void {
    this.curPage.next(page);
  }

  onScrollDown(): void {
    if(((this.cont) * this.page) < (this.productsSize + this.page)){
      this.isLoading = true;
      this.curPage.next(++this.page); 
    }
  }

  /**
   * Adding product to shopping cart
   */
  addCart(product: Product): void{
        
    if (!this.user){
      this.dialog.alert("Alert", "Please log in to purchase", true, this.viewContainerRef);
    }else{

      this.productSub = MeteorObservable.subscribe('productExitsInStock', product._id).subscribe(() => {
        let productInStock = Products.findOne(product._id);

        if (productInStock.quantityInStock > 0){
          this.shoppingCart.addPurchaseItem(product, this.user._id);
          this.snackBar.open('Adding Product to shopping cart...', 'X', {duration: 1200});
        } else {
          this.snackBar.open('Quantity in stock is zero.', 'X', {duration: 1200});
        }
      });      
    }        
  }

  ngOnDestroy() {
    if (this.productSub){
      this.productSub.unsubscribe();
    }    
    this.querySub.unsubscribe();
    this.optionsSub.unsubscribe();    
    this.autorunSub.unsubscribe();
    this.thumbsSub.unsubscribe();
    this.shoppingCart.unsubscribePurchaseOrder();    
  }
}