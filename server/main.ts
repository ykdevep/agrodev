import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import { loadProducts } from './imports/fixtures/products';

import './imports/publications/products';
import './imports/publications/routes';
import './imports/publications/users';
import './imports/publications/images';
import './imports/publications/purchase';

Meteor.startup(() => {
  loadProducts();
  console.log("Start server");
});