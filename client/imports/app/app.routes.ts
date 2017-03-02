import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { LoginComponent } from './auth/login.component';
import { SignupComponent } from './auth/singup.component';
import { RecoverComponent } from './auth/recover.component';

import { HomeComponent } from './home/home.component';
import { ProductComponent } from './home/product.component';

import { ProductListComponent } from './product/product-list.component';
import { ProductDetailsComponent } from './product/product-details.component';

import { RouteListComponent } from './route/route-list.component';
import { RouteDetailsComponent } from './route/route-details.component';

import { MyPurchaseOrderComponent } from './purchase-order/my-purchase-order.component';

import { AboutComponent} from './static-pages/about.component';
import { HelpComponent} from './static-pages/help.component';

export const routes: Route[] = [
  { path: '', component: HomeComponent, data: { title: 'Home | APP' } },
  { path: 'product/:productId', component: ProductComponent, data: { title: 'My Calendar' }},
  { path: 'user/products', component: ProductListComponent, canActivate: ['canActivateForLoggedIn'], data: { title: 'My Calendar' } },
  { path: 'user/purchases', component: MyPurchaseOrderComponent, canActivate: ['canActivateForLoggedIn'] },
  { path: 'user/product/:productId', component: ProductDetailsComponent, canActivate: ['canActivateForLoggedIn'] },
  { path: 'user/routes', component: RouteListComponent, canActivate: ['canActivateForLoggedIn'] },
  { path: 'user/route/:routeId', component: RouteDetailsComponent, canActivate: ['canActivateForLoggedIn'] },
  { path: 'login', component: LoginComponent, data: { title: 'Login | APP' } },
  { path: 'signup', component: SignupComponent, data: { title: 'Singup | APP' } },
  { path: 'recover', component: RecoverComponent, data: { title: 'Recover | APP' } },
  { path: 'about', component: AboutComponent, data: { title: 'About | APP' } },
  { path: 'help', component: HelpComponent, data: { title: 'Help | APP' } }
];

export const ROUTES_PROVIDERS = [{
  provide: 'canActivateForLoggedIn',
  useValue: () => !! Meteor.userId()
}];