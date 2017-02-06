import { Routes } from '../collections/routes.collection';
import { GeoLocation } from '../models/route.model';
import { Route } from '../models/route.model'; 
import {Meteor} from 'meteor/meteor';

Meteor.methods({
  insert_route: function (name: string, description: string, startRoute: GeoLocation, finalRoute: GeoLocation, price: number): void {
    
    if (!this.userId)
      throw new Meteor.Error('403', 'You must be logged-in to insert Route');

    if (Meteor.isServer){
        Routes.insert({
            name: name,
            description: description,
            startRoute: startRoute,
            finalRoute: finalRoute,
            price: price,            
            signature: {
                createdAt: new Date,
                updatedAt: new Date,
                createdBy: Meteor.userId(),
                updatedBy: Meteor.userId()
            }
        });
    }    
  },
  update_route: function (route: Route): void {
    
    if (!this.userId)
      throw new Meteor.Error('403', 'You must be logged-in to update Product');

    if (Meteor.isServer){

        Routes.update(route._id, {
            $set: {
                name: route.name,
                description: route.description,
                startRoute: route.startRoute,
                finalRoute: route.finalRoute,
                price: route.price,
                signature: {
                    createdBy: route.signature.createdBy,
                    createdAt: route.signature.createdAt,
                    updatedAt: new Date,
                    updatedBy: Meteor.userId()
                }
            }
        });       
    }    
  }
});