import { Meteor } from 'meteor/meteor';

import { loadProducts } from './imports/fixtures/products';

import './imports/publications/products';
import './imports/publications/routes';
import './imports/publications/users';
import './imports/publications/images';
import './imports/publications/purchase';

Meteor.startup(() => {
  loadProducts();
});