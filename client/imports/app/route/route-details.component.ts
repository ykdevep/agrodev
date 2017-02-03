import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';

import { Meteor } from 'meteor/meteor'; 
import { MeteorObservable } from 'meteor-rxjs';
import { InjectUser } from "angular2-meteor-accounts-ui";

import { MouseEvent } from "angular2-google-maps/core";
import {MdSnackBar, MdSnackBarConfig} from '@angular/material';
import { DialogsService } from '../dialog/dialogs.service';

import { Routes } from '../../../../both/collections/routes.collection';
import { Route } from '../../../../both/models/route.model';

import template from './route-details.component.html';

@Component({
  selector: 'route-details',
  template
})

@InjectUser('user')
export class RouteDetailsComponent implements OnInit, OnDestroy {
  
    routeId: string;
    paramsSub: Subscription;
    route: Route;
    routeSub: Subscription;
    querySub: Subscription;

    query = {page: 1, name: '', order: -1};

    user: Meteor.User;
    // Default center of mexico city.
    centerLat: number = 19.433789301234;
    centerLng: number = -99.1351318359375;
    
    constructor(private routes: ActivatedRoute,
         private snackBar: MdSnackBar,
         private dialog: DialogsService,
         private viewContainerRef: ViewContainerRef) {}

    ngOnInit(){
        this.paramsSub = this.routes.params
            .map(params => params['routeId'])
            .subscribe(routeId => {
                this.routeId = routeId
                
                if (this.routeSub) {
                    this.routeSub.unsubscribe();
                }

                this.routeSub = MeteorObservable.subscribe('route', this.routeId).subscribe(() => {
                    this.route = Routes.findOne(this.routeId);
                });
            });
        
        this.querySub = this.routes.queryParams
            .map(params => params)
            .subscribe(params => {
                this.query = {page: params["page"], name: params["name"], order: +params["order"]};
            });
    }

    get isOwner(): boolean {
        return this.route && this.user && this.user._id === this.route.owner;
    }

    saveRoute() {
        if (!Meteor.userId()) {
            this.dialog.alert("Alert", "Please log in to change this route", false,this.viewContainerRef)
        return;
        }
        
        Routes.update(this.route._id, {
            $set: {
                name: this.route.name,
                startRoute: this.route.startRoute,
                finalRoute: this.route.finalRoute,
                price: this.route.price,
                description: this.route.description,                
            }
        });
        let config = new MdSnackBarConfig();
        config.duration = 3000;
        this.snackBar.open('Route edited!', 'X', config);
    }

    ngOnDestroy(){
        this.paramsSub.unsubscribe();
        this.routeSub.unsubscribe();
        this.querySub.unsubscribe();
    }

    get latS(): number {
        return this.route && this.route.startRoute.lat;
    }    

    get lngS(): number {
        return this.route && this.route.startRoute.lng;
    }

    get latF(): number {
        return this.route && this.route.finalRoute.lat;
    }    

    get lngF(): number {
        return this.route && this.route.finalRoute.lng;
    }    

    markerDragEndStart($event: MouseEvent) {
        this.route.startRoute.lat = $event.coords.lat;
        this.route.startRoute.lng = $event.coords.lng;
    }

    markerDragEndFinal($event: MouseEvent) {
        this.route.finalRoute.lat = $event.coords.lat;
        this.route.finalRoute.lng = $event.coords.lng;
    }   
     
}