import { Meteor } from 'meteor/meteor';
import { Routes } from '../../../both/collections/routes.collection';
import { Counts } from 'meteor/tmeasday:publish-counts';

interface Options {
    [key: string]: any;
}

Meteor.publish('routes', function (options: Options, name?: string) {
  const selector = buildQuery.call(this, null, name);
  Counts.publish(this, 'numberOfRoutes', Routes.collection.find(selector), { noReady: true });
  return Routes.find(selector, options);
}); 

Meteor.publish('route', function(routeId: string) {
  return Routes.find(buildQuery.call(this, routeId));
});

function buildQuery(routeId?: string, name?: string): Object {
  const isAvailable = {
    $or: [
     { 
      // current user is the owner
      $and: [{
        'signature.createdBy': this.userId 
      }, {
        'signature.createdBy': {
          $exists: true
        }
      }]
    }]
  };

  if (routeId) {
    return {
      // only single route
      $and: [{
          _id: routeId
        },
        isAvailable
      ]
    };
  }

  const searchRegEx = { '$regex': '.*' + (name || '') + '.*', '$options': 'i' };

  return {
    $and: [{
      name: searchRegEx
      },
      isAvailable
    ]
  };
}