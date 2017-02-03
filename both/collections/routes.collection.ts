import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';

import { Route } from '../models/route.model';

export const Routes = new MongoObservable.Collection<Route>('routes');

function loggedIn() {
  return !!Meteor.user();
}

Routes.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});