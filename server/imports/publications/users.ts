import { Meteor } from 'meteor/meteor';
import { Users } from '../../../both/collections/users.collection';
import { Counts } from 'meteor/tmeasday:publish-counts';

interface Options {
    [key: string]: any;
}

Meteor.publish('users', function (options: Options, name?: string) {
  const selector = buildQuery.call(this, null, name);
  Counts.publish(this, 'numberOfRoutes', Users.collection.find(selector), { noReady: true });
  return Users.find(selector, options);
}); 

Meteor.publish('user', function(userId: string) {
  return Users.find(buildQuery.call(this, userId));
});

function buildQuery(userId?: string): Object {
  
  if (userId) {
    return {
      // only single Users
      $and: [{
          _id: userId
        }
      ]
    };
  }

  const searchRegEx = { '$regex': '.*' + (name || '') + '.*', '$options': 'i' };

  return {
    $and: [{
      name: searchRegEx
      }      
    ]
  };
}