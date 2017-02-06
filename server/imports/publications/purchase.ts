import { Meteor } from 'meteor/meteor';
import { PurchaseOrders } from '../../../both/collections/purchase.collection';
import { Counts } from 'meteor/tmeasday:publish-counts';

interface Options {
    [key: string]: any;
}

Meteor.publish('purchaseOrderByUserId', function(options: Options){
  return PurchaseOrders.find(options);
});

Meteor.publish('purchaseOrders', function (options: Options, min?: number, max?: number) {
  const selector = buildQuery.call(this, min, max);
  Counts.publish(this, 'numberOfPurchaseOrder', PurchaseOrders.collection.find(selector), { noReady: true });
  return PurchaseOrders.find(selector, options);
});

/**
 * Query than to select user purchase order
 */
function buildQuery(min?: number, max?: number): Object {
  const isAvailable =  {
      $and: [
      { 
        // current user is the owner
        $and: [{
          'signature.createdBy': this.userId 
        }, {
          'signature.createdBy': {
            $exists: true
          }
        }, {
          status: 1
        }]
      }]
    };

    if (min && max){
      return {$and: [ {
            totalPrice: {$gte: min} 
          }, {
            totalPrice: {$lte: max} 
          },
          isAvailable
        ]
      };
    }else if (min){      
      return {$and: [{
            totalPrice: {$gte: min} 
          },
          isAvailable
        ]
      };
    }else if (max){
      return {$and: [ {
            totalPrice: {$lte: max} 
          },
          isAvailable
        ]
      };
    }else {
      return{
        $and: [
          isAvailable
        ]
      };    
    }     
}