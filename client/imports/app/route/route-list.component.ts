import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

import { Routes } from '../../../../both/collections/routes.collection';
import { Route } from '../../../../both/models/route.model'; 

interface Pagination {
  limit: number;
  skip: number;
}

interface Options extends Pagination {
  [key: string]: any;
}

import template from './route-list.component.html';

@Component({
  selector: 'route-list',
  template
})

@InjectUser('user')
export class RouteListComponent implements OnInit, OnDestroy {
  
  isLoading = true;
  searchForm: FormGroup;

  routes: Observable<Route[]>; 
  routesSub: Subscription;
  querySub: Subscription;

  pageSize: Subject<number> = new Subject<number>();
  curPage: Subject<number> = new Subject<number>();
  nameOrder: Subject<number> = new Subject<number>();
  optionsSub: Subscription;
  routesSize: number = 0;
  autorunSub: Subscription;
  name: Subject<string> = new Subject<string>();
  user: Meteor.User;
  
  query = {page: 1, name: '', order: -1};
  
  constructor(private route: ActivatedRoute,
    private paginationService: PaginationService,
    private formBuilder: FormBuilder,
    private snackBar: MdSnackBar,
    private dialog: DialogsService,
    private viewContainerRef: ViewContainerRef
  ) {}

  isOwner(route: Route): boolean {
    return this.user && this.user._id === route.owner;
  }

  ngOnInit() {
        
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

      if (this.routesSub) {
        this.routesSub.unsubscribe();
      }      

      this.routesSub = MeteorObservable.subscribe('routes', options, name).subscribe(() => {
        this.routes = Routes.find({}, {
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
      totalItems: this.routesSize,
    });

    this.autorunSub = MeteorObservable.autorun().subscribe(() => {
      this.routesSize = Counts.get('numberOfRoutes');
      this.paginationService.setTotalItems(this.paginationService.defaultId, this.routesSize);
    });

  }

  removeRoute(route: Route): void {
    this.dialog.confirm("Alert", "Are you sure to want delete this route?", this.viewContainerRef).subscribe(result => {
      if(result){
        Routes.remove(route._id);
        let config = new MdSnackBarConfig();
        config.duration = 3000;
        this.snackBar.open('Route deleted!', 'X', config);
      }
    });
 }

  /**
   * Searching routes by name
   */
  search(): void {
    let config = new MdSnackBarConfig();
    config.duration = 3000;

    if (this.searchForm.valid){    
      this.curPage.next(1);      
      this.name.next(this.searchForm.value.name);  
      this.snackBar.open('Searching...', 'X', config);    
    } else {
      this.snackBar.open('Form have errors!', 'X', config);
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
    this.routesSub.unsubscribe();
    this.optionsSub.unsubscribe();
    this.autorunSub.unsubscribe();
    this.querySub.unsubscribe();
  } 
}