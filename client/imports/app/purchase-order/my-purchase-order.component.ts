import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {MdSnackBar, MdSnackBarConfig} from '@angular/material';
import { DialogsService } from '../dialog/dialogs.service';

import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/combineLatest';

import { MeteorObservable } from 'meteor-rxjs';
import { PaginationService } from 'ng2-pagination';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { InjectUser } from "angular2-meteor-accounts-ui";

import { PurchaseOrders } from '../../../../both/collections/purchase.collection';
import { PurchaseOrder } from '../../../../both/models/purchase.model'; 

import template from './my-purchase-order.component.html'; 

interface Pagination {
  limit: number;
  skip: number;
}

interface Options extends Pagination {
  [key: string]: any;
}

@Component({
  selector: 'my-purchase-order-list',
  template
})

@InjectUser('user')
export class MyPurchaseOrderComponent implements OnInit, OnDestroy {  
  isLoading = true;  
  searchForm: FormGroup;

  purchaseOrders: Observable<PurchaseOrder[]>; 
  purchaseSub: Subscription;
  querySub: Subscription;
  
  pageSize: Subject<number> = new Subject<number>();
  curPage: Subject<number> = new Subject<number>();
  min: Subject<number> = new Subject<number>();
  max: Subject<number> = new Subject<number>();
  priceOrder: Subject<number> = new Subject<number>();
  
  purchaseSize: number = 0;
  
  autorunSub: Subscription;
  optionsSub: Subscription;
  thumbsSubs: Subscription;

  user: Meteor.User;
    
  constructor(
    private paginationService: PaginationService,
    private formBuilder: FormBuilder,
    private snackBar: MdSnackBar,
    private dialog: DialogsService,
    private viewContainerRef: ViewContainerRef
  ) {}

  /**
   * Initializate attributes of this class
   */
  ngOnInit() {
    this.thumbsSubs = MeteorObservable.subscribe('thumb').subscribe();
    
    this.optionsSub = Observable.combineLatest(
      this.pageSize,
      this.curPage,
      this.priceOrder,
      this.min,
      this.max
    ).subscribe(([pageSize, curPage, priceOrder, min, max]) => {
      
      const options: Options = {
        limit: pageSize as number,
        skip: ((curPage as number) - 1) * (pageSize as number),
        sort: {totalPrice: priceOrder as number }
      };

      this.paginationService.setCurrentPage(this.paginationService.defaultId, curPage as number);

      if (this.purchaseSub) {
        this.purchaseSub.unsubscribe();
      }      

      this.purchaseSub = MeteorObservable.subscribe('purchaseOrders', options, min, max).subscribe(() => {
        this.purchaseOrders = PurchaseOrders.find({}, {}).zone();
        this.isLoading = false;
      });
    });

    this.searchForm = this.formBuilder.group({
      min: [],
      max: []      
    });

    this.paginationService.register({
      id: this.paginationService.defaultId,
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.purchaseSize,
    });

    this.pageSize.next(10);
    this.curPage.next(1);
    this.priceOrder.next(1);
    this.min.next();
    this.max.next();   

    this.autorunSub = MeteorObservable.autorun().subscribe(() => {
      this.purchaseSize = Counts.get('numberOfPurchaseOrder');
      this.paginationService.setTotalItems(this.paginationService.defaultId, this.purchaseSize);
    });      
  }

  /**
   * Search by min and max price
   */
  search(): void {
    let config = new MdSnackBarConfig();
    config.duration = 3000;

    if (this.searchForm.valid){    
      this.curPage.next(1);      
      if (this.searchForm.value.min){
        this.min.next(+this.searchForm.value.min);
      } else {
        this.min.next();
      }
      
      if (this.searchForm.value.max){
        this.max.next(+this.searchForm.value.max);
      } else {
        this.max.next();
      }
      this.snackBar.open('Searching...', 'X', config);
    }else{
      this.snackBar.open('Form have errors!', 'X', config);
    }    
  }  

  /**
   * Method for change page in paginator
   */
  onPageChanged(page: number): void {
    this.curPage.next(page);
  }

  /**
   * Method for order by total pricee
   */
  changeSortOrder($event): void {
    if ($event.checked){
      this.priceOrder.next(-1);      
    }else {
      this.priceOrder.next(1);
    }    
  }

  /**
   * Destroy attributes subscribes
   */  
  ngOnDestroy() {
    this.purchaseSub.unsubscribe();
    this.optionsSub.unsubscribe();
    this.autorunSub.unsubscribe();
  }
}