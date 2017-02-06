import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import {MdSnackBar} from '@angular/material';
import { DialogsService } from '../dialog/dialogs.service';

import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { MeteorObservable } from 'meteor-rxjs';
import { PaginationService } from 'ng2-pagination';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { InjectUser } from "angular2-meteor-accounts-ui";

import 'rxjs/add/operator/combineLatest';

import { Products } from '../../../../both/collections/products.collection';
import { Product } from '../../../../both/models/product.model'; 
import { Images } from '../../../../both/collections/images.collection';

import template from './product-list.component.html'; 

interface Pagination {
  limit: number;
  skip: number;
}

interface Options extends Pagination {
  [key: string]: any;
}

@Component({
  selector: 'product-list',
  template
})

@InjectUser('user')
export class ProductListComponent implements OnInit, OnDestroy {
  isLoading = true;  
  searchForm: FormGroup;

  products: Observable<Product[]>; 
  productsSub: Subscription;
  querySub: Subscription;
  
  pageSize: Subject<number> = new Subject<number>();
  curPage: Subject<number> = new Subject<number>();
  nameOrder: Subject<number> = new Subject<number>();
  optionsSub: Subscription;
  productsSize: number = 0;
  autorunSub: Subscription;
  name: Subject<string> = new Subject<string>();
  user: Meteor.User;
  imagesSubs: Subscription;

  query = {page: 1, name: '', order: -1};
  
  constructor(private route: ActivatedRoute,
    private paginationService: PaginationService,
    private formBuilder: FormBuilder,
    private snackBar: MdSnackBar,
    private dialog: DialogsService,
    private viewContainerRef: ViewContainerRef
  ) {}

  isOwner(product: Product): boolean {
    return this.user && this.user._id === product.signature.createdBy;
  }

  ngOnInit() {
    this.imagesSubs = MeteorObservable.subscribe('images').subscribe();

    this.optionsSub = Observable.combineLatest(
      this.pageSize,
      this.curPage,
      this.nameOrder,
      this.name
    ).subscribe(([pageSize, curPage, nameOrder, name]) => {
      const options: Options = {
        limit: pageSize as number,
        skip: ((curPage as number) - 1) * (pageSize as number),
        sort: { name: nameOrder as number }
      };

      this.query = {page: curPage, name: name, order: nameOrder};
      
      this.paginationService.setCurrentPage(this.paginationService.defaultId, curPage as number);

      if (this.productsSub) {
        this.productsSub.unsubscribe();
      }      

      this.productsSub = MeteorObservable.subscribe('products', options, name).subscribe(() => {
        this.products = Products.find({}, {
          sort: {
            name: nameOrder
          }
        }).zone();
        this.isLoading = false;
      });
    });

    this.querySub = this.route.queryParams
        .map(params => params)
        .subscribe(params => {          
          if (params["page"]){
            this.pageSize.next(10);
            this.name.next(params["name"]);
            this.nameOrder.next(+params["order"]);
            this.curPage.next(+params["page"]);      
          }else{            
            this.pageSize.next(10);
            this.curPage.next(1);
            this.nameOrder.next(-1);
            this.name.next('');
          }
        });
    
    this.searchForm = this.formBuilder.group({
      name: [this.query.name]      
    });

    this.paginationService.register({
      id: this.paginationService.defaultId,
      itemsPerPage: 10,
      currentPage: this.query.page,
      totalItems: this.productsSize,
    });

    this.autorunSub = MeteorObservable.autorun().subscribe(() => {
      this.productsSize = Counts.get('numberOfProducts');
      this.paginationService.setTotalItems(this.paginationService.defaultId, this.productsSize);
    });    
  }

  removeProduct(product: Product): void {
    this.dialog.confirm("Alert", "Are you sure you want to delete this product?", this.viewContainerRef).subscribe(result => {
      
      if(result){
        product.images.forEach(element => {
          Images.remove({_id: element});
        });
        Products.remove(product._id);
        this.snackBar.open('Product deleted!', 'X', {duration: 1200});
      }
    });        
  }

  search(): void {
    if (this.searchForm.valid){    
      this.curPage.next(1);      
      this.name.next(this.searchForm.value.name); 
      this.snackBar.open('Searching...', 'X', {duration: 1200});
    }else{
      this.snackBar.open('Form have errors!', 'X', {duration: 1200});
    }    
  }  

  onPageChanged(page: number): void {
    this.curPage.next(page);
  }

  /**
   * Change the order of product listed
   */
  changeSortOrder($event): void {
    this.query.order = this.query.order * (-1);
    this.nameOrder.next(this.query.order);
  }
  
  ngOnDestroy() {
    this.productsSub.unsubscribe();
    this.optionsSub.unsubscribe();
    this.autorunSub.unsubscribe();
    this.querySub.unsubscribe();
    this.imagesSubs.unsubscribe();
  }
}