import { Products } from '../collections/products.collection';
import { GeoLocation } from '../models/product.model';
import { Product } from '../models/product.model'; 
import {Meteor} from 'meteor/meteor';

Meteor.methods({
  insert_product: function (name: string, description: string, location: GeoLocation, onSale: boolean, quantityInStock: number, unitPrice: number, images: string[]): void {
    
    if (!this.userId)
      throw new Meteor.Error('403', 'You must be logged-in to insert Product');

    if (Meteor.isServer){
        Products.insert({
            name: name,
            description: description,
            location: location,
            onSale: onSale,
            quantityInStock: quantityInStock,
            unitPrice: unitPrice,
            oldsPrice: [],
            images: images,
            popularity: 0,
            signature: {
                createdAt: new Date,
                updatedAt: new Date,
                createdBy: Meteor.userId(),
                updatedBy: Meteor.userId()
            }
        });
    }    
  },
  update_product: function (product: Product): void {
    
    if (!this.userId)
      throw new Meteor.Error('403', 'You must be logged-in to update Product');

    if (Meteor.isServer){

        Products.update(product._id, {
            $set: {
                name: product.name,
                description: product.description,
                location: product.location,
                onSale: product.onSale,
                quantityInStock: product.quantityInStock,
                unitPrice: product.unitPrice,
                oldsPrice: product.oldsPrice,
                images: product.images,
                popularity: 0,
                signature: {
                    createdBy: product.signature.createdBy,
                    createdAt: product.signature.createdAt,
                    updatedAt: new Date,
                    updatedBy: Meteor.userId()
                }
            }
        });       
    }    
  }
});