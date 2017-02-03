import { Meteor } from 'meteor/meteor';
import { Thumbs, Images } from '../../../both/collections/images.collection';

Meteor.publish('thumbs', function(ids: string[]) {
  return Thumbs.collection.find({
    originalStore: 'images',
    originalId: {
      $in: ids
    }
  });
});

Meteor.publish('thumb', function() {
  return Thumbs.collection.find({
    originalStore: 'images'  
  });
});

Meteor.publish('images', function() {
  return Images.collection.find({});
});

Meteor.publish('image', function(imageId: string) {
  return Images.collection.find({id: imageId});
});
