import { Products } from '../../../both/collections/products.collection';
import { Product } from '../../../both/models/product.model';

export function loadProducts() {
  if (Products.find().cursor.count() === 0) {
    const products: Product[] = [{
      name: 'Dubstep-Free Zone',
      description: 'Can we please just for an evening not listen to dubstep.',
      quantityInStock: 10,
      unitPrice: 20,
      oldPrice: 2,
      location: {
        name: 'Palo Alto'
      },
      onSale: true,
      popularity: 2
    }, {
      name: 'All dubstep all the time',
      description: 'Get it on!',
      quantityInStock: 10,
      unitPrice: 20,
      oldPrice: 2,
      location: {
        name: 'Palo Alto'
      },
      onSale: true,
      popularity: 2
    }, {
      name: 'Savage lounging',
      description: 'Leisure suit required. And only fiercest manners.',
      quantityInStock: 10,
      unitPrice: 20,
      oldPrice: 2,
      location: {
        name: 'San Francisco'
      },
      onSale: true,
      popularity: 22
    }];

    products.forEach((product: Product) => Products.insert(product));
  }

  /*for (var i = 0; i < 100; i++) {
    Products.insert({
      name: "a"+i,
      quantityInStock: i*10,
      unitPrice: i+10,
      oldPrice: 0,      
      location: {
        name: "location"
      },
      description: "Description other words",
      onSale: true,
      images : [ "E7MjBFag5F6aPpC3D" ],
      popularity: 2,
      owner : "jFvNc7eSRRojfDhuE",
    });
  }*/
}