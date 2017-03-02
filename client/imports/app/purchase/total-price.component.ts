import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../services/shoppingCart.service';

import template from './total-price.component.html';

@Component({
  selector: 'total-price',
  template
})

export class TotalPriceComponent implements OnInit {

      
  constructor(
     private shoppingCart: ShoppingCartService) {}

  ngOnInit(){
    
  }

}