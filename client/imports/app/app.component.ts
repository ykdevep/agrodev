import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { Translation, LocaleService, TranslationService } from 'angular-l10n';
import { ShoppingCartService } from './services/shoppingCart.service';

import {InjectUser} from "angular2-meteor-accounts-ui";
import { MdSnackBar } from '@angular/material';

import template from './app.component.html';
import style from './app.component.scss';

@Component({
  selector: 'app',
  template,
  styles: [style]
})

@InjectUser('user')
export class AppComponent extends Translation implements OnInit {

  year: number;
  
  constructor(
    private shoppingCart: ShoppingCartService,
    private snackBar: MdSnackBar,
    public locale: LocaleService,
    public translation: TranslationService,
    private router: Router,
    private titleService: Title,
    private activatedRoute: ActivatedRoute) {
      super(translation);
      let date = new Date();
      this.year = date.getUTCFullYear(); 

      this.locale.AddConfiguration()
          .AddLanguages(['en', 'es'])
          .SetCookieExpiration(30)
          .DefineLanguage('en');
      this.locale.init();

      this.translation.AddConfiguration()
          .AddProvider('./languages/locale-');
      this.translation.init();
  }

  /**
   * Init the component and app
   */
  ngOnInit() {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })
      .filter(route => route.outlet === 'primary')
      .mergeMap(route => route.data)
      .subscribe((event) => this.titleService.setTitle(event['title']));
  }

  /**
   * Change language in this app
   */
  selectLanguage(language: string): void {
      this.locale.setCurrentLanguage(language);
  }

  /**
   * Log out function and destroy a purchase order
   */
  logout() {
    Meteor.logout();    
    this.snackBar.open("Logout user", 'X', {duration: 3000})
    this.shoppingCart.destroyPurchaseOrder();
  }
}