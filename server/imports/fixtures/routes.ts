import { Routes } from '../../../both/collections/routes.collection';
import { Route } from '../../../both/models/route.model';

export function loadRoutes() {
  if (Routes.find().cursor.count() === 0) {
    const routes: Route[] = [{
      name: 'Dubstep-Free Zone',
      description: 'Can we please just for an evening not listen to dubstep.',
      price: 2,
      startRoute: {
        name: 'Palo Alto'
      },
      finalRoute: {
        name: 'Havana'
      },
      
    },
    {name: 'Dubstep-Free Zone',
      description: 'Can we please just for an evening not listen to dubstep.',
      price: 2,
      startRoute: {
        name: 'Palo Alto'
      },
      finalRoute: {
        name: 'Havana'
      },
      
    }];

    routes.forEach((route: Route) => Routes.insert(route));
  }
}