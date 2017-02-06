import { Meteor } from 'meteor/meteor';
import { Products } from '../../../both/collections/products.collection';
import { Counts } from 'meteor/tmeasday:publish-counts';

interface Options {
    [key: string]: any;
}

Meteor.publish('products', function (options: Options, name?: string) {
  const selector = buildQuery.call(this, null, name);
  Counts.publish(this, 'numberOfProducts', Products.collection.find(selector), { noReady: true });
  return Products.find(selector, options);
});

Meteor.publish('product', function(productId: string) {
  return Products.find(buildQuery.call(this, productId));
}); 

Meteor.publish('productExitsInStock', function(productId: string) {
  return Products.find(buildQueryQuantityInStock.call(this, productId));
});

Meteor.publish('home', function (options: Options, name?: string, min?: number, max?: number) {
  const selector = buildQueryHome.call(this, name, min, max);
  Counts.publish(this, 'numberOfProducts', Products.collection.find(selector), { noReady: true });
  return Products.find(selector, options);
});

Meteor.publish('details', function(productId: string) {
  return Products.find(buildQueryDetails.call(this, productId));
});

/**
 * Query than to select home products 
 */
function buildQueryHome(name?: string, min?: number, max?: number): Object {
  const isAvailable = {
    $and: [
     { 
      $and: [{
        onSale: true 
      },{
        quantityInStock: {$gt: 0} 
      },{
        'signature.createdBy': {
          $exists: true
        }
      }]
    }]
  };

  const searchRegEx = { '$regex': '.*' + (name || '') + '.*', '$options': 'i' };

  if (min && max){
    return {$and: [{
        name: searchRegEx
        }, {
          unitPrice: {$gte: min} 
        }, {
          unitPrice: {$lte: max} 
        },
        isAvailable
      ]
    };
  }else if (min){
    return {$and: [{
        name: searchRegEx
        }, {
          unitPrice: {$gte: min} 
        },
        isAvailable
      ]
    };
  }else if (max){
    return {$and: [{
        name: searchRegEx
        }, {
          unitPrice: {$lte: max} 
        },
        isAvailable
      ]
    };
  }else {
    return {
    $and: [{
      name: searchRegEx
      },
      isAvailable
    ]
  };
  }  
}

function buildQueryDetails(productId?: string): Object {
    if (productId) {
      return {
        // only single product
        $and: [{
            _id: productId
          }]
      };
  }  
}

function buildQuery(productId?: string, name?: string): Object {
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

  if (productId) {
    return {
      // only single product
      $and: [{
          _id: productId
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

function buildQueryQuantityInStock(productId: string): Object {
  const isAvailable = {
    $and: [
     { 
      // current user is the owner
      $and: [{
        onSale: true 
      },{
        quantityInStock: {$gt: 0} 
      },{
        'signature.createdBy': {
          $exists: true
        }
      }]
    }]
  };

  return {
    // only single product
    $and: [{
        _id: productId
      },
      isAvailable
    ]
  }; 
}