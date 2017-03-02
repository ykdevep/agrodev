import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccountsModule } from 'angular2-meteor-accounts-ui';
import { Ng2PaginationModule } from 'ng2-pagination';
import { AgmCoreModule } from 'angular2-google-maps/core';

import { HttpModule } from '@angular/http';
import { TranslationModule } from 'angular-l10n';

import { AppComponent } from './app.component';
import { routes, ROUTES_PROVIDERS } from './app.routes';
import { HOME_DECLARATIONS } from './home';
import { PRODUCT_DECLARATIONS } from './product';
import { PURCHASE_DECLARATIONS } from './purchase';
import { PURCHASE_ORDER_DECLARATIONS } from './purchase-order';
import { ROUTE_DECLARATIONS } from './route';
import { STATIC_PAGES_DECLARATIONS } from './static-pages';
import { SHARED_DECLARATIONS } from './shared';

import 'hammerjs';
import { MaterialModule } from "@angular/material";
import { FlexLayoutModule } from "@angular/flex-layout";

import { ConfirmDialog } from './dialog/confirm.component';
import { AlertDialog } from './dialog/alert.component';
import { DialogsService } from './dialog/dialogs.service';
import { ShoppingCartService } from './services/shoppingCart.service';

import { AUTH_DECLARATIONS } from './auth/index';
import { FileDropModule } from 'angular2-file-drop';
import { EqualValidator } from './auth/equal-validator.directive';

@NgModule({
  imports: [
    BrowserModule,
    InfiniteScrollModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    HttpModule,
    TranslationModule.forRoot(),
    AccountsModule,
    Ng2PaginationModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAWoBdZHCNh5R-hB5S5ZZ2oeoYyfdDgniA'
    }),
    MaterialModule.forRoot(),
    FlexLayoutModule,
    FileDropModule
  ],
  exports: [
    ConfirmDialog,
    AlertDialog
  ],
  declarations: [
    AppComponent,
    ConfirmDialog,
    AlertDialog,
    EqualValidator,    
    ...SHARED_DECLARATIONS,
    ...AUTH_DECLARATIONS,
    ...HOME_DECLARATIONS,
    ...PRODUCT_DECLARATIONS,
    ...PURCHASE_DECLARATIONS,
    ...PURCHASE_ORDER_DECLARATIONS,
    ...ROUTE_DECLARATIONS,
    ...STATIC_PAGES_DECLARATIONS
  ],
  entryComponents: [
    ConfirmDialog,
    AlertDialog
  ],
  providers: [
    ...ROUTES_PROVIDERS,
    Title,
    DialogsService,
    ShoppingCartService
  ],
  bootstrap: [
    AppComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}