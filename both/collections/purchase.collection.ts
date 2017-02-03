import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';

import { PurchaseItem } from '../models/purchase.model';
import { PurchaseOrder } from '../models/purchase.model';

export const PurchaseItems = new MongoObservable.Collection<PurchaseItem>('purchaseItem');
export const PurchaseOrders = new MongoObservable.Collection<PurchaseOrder>('purchaseOrder');

function loggedIn() {
  return !!Meteor.user();
}

PurchaseItems.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});

PurchaseOrders.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});