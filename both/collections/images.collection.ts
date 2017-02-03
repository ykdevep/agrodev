import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';
import { Thumb, Image } from "../models/image.model";
import { UploadFS } from 'meteor/jalik:ufs';

import { Mongo} from 'meteor/mongo';

export const Images = new MongoObservable.Collection<Image>('images');
export const Thumbs = new MongoObservable.Collection<Thumb>('thumbs');

// Use HTTPS in URLs
UploadFS.config.https = false;

// Activate simulation for slowing file reading
UploadFS.config.simulateReadDelay = 1000; // 1 sec

// Activate simulation for slowing file uploading
UploadFS.config.simulateUploadSpeed = 128000; // 128kb/s

// Activate simulation for slowing file writing
UploadFS.config.simulateWriteDelay = 2000; // 2 sec

// This path will be appended to the site URL, be sure to not put a "/" as first character
// for example, a PNG file with the _id 12345 in the "photos" store will be available via this URL :
// http://www.yourdomain.com/uploads/photos/12345.png
UploadFS.config.storesPath = 'uploads';

// Set the temporary directory where uploading files will be saved
// before sent to the store.
UploadFS.config.tmpDir = '/tmp/uploads';

// Set the temporary directory permissions.
UploadFS.config.tmpDirPermissions = '0700';

export const ThumbsStore = new UploadFS.store.GridFS({
  collection: Thumbs.collection,
  name: 'thumbs',
  transformWrite(from, to, fileId, file) {
    // Resize to 100x100
    const gm = require('gm');

    gm(from, file.name)
      .resize(300, 200)
      .gravity('Center')
      .extent(300, 200)
      .quality(75)
      .stream()
      .pipe(to);
  }
});

export const ImagesStore = new UploadFS.store.GridFS({
  collection: Images.collection,
  name: 'images',
  filter: new UploadFS.Filter({
    contentTypes: ['image/*']
  }),
  copyTo: [
    ThumbsStore
  ]
});

function loggedIn(userId) {
  return !!userId;
}

Thumbs.collection.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});

Images.collection.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});