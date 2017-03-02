import { Injectable} from '@angular/core';

import {Products} from '../../../../both/collections/products.collection';
import {PurchaseItems} from '../../../../both/collections/purchase.collection';
import {Product} from '../../../../both/models/product.model';
import {PurchaseItem} from '../../../../both/models/purchase.model';
import {PurchaseOrder} from '../../../../both/models/purchase.model';
import {PurchaseOrders} from '../../../../both/collections/purchase.collection';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { MeteorObservable } from 'meteor-rxjs';

enum Status	{submitted, shipped, received, returned};

interface Options {
  [key: string]: any;
}

@Injectable()
export class ShoppingCartService{

    private purchaseItems: Array<PurchaseItem> = [];    
    private totalPrice: number = 0;
    private totalBalance: number = 0;
    private totalTax: number = 0;
    private purchaseOrder: PurchaseOrder;
    private tax: number = 0.10;

    private purchaseOrderSubscription: Subscription;

    /**
     * Unsubscribe purchase order
     */
    unsubscribePurchaseOrder(): void {
        if (this.purchaseOrderSubscription){
            this.purchaseOrderSubscription.unsubscribe();            
        }       
    }

    /**
     * Init purchase order
     */
    initPurchaseOrder(userId: string): void {
        const options: Options = {
            createdBy: userId,
            status: 0      
        };

        this.purchaseOrderSubscription = MeteorObservable.subscribe<PurchaseOrder>("purchaseOrderByUserId", options).subscribe(() => {

            this.purchaseOrder = PurchaseOrders.findOne({createdBy: userId, status: 0}); 

            if (this.purchaseOrder){
                this.totalPrice = this.purchaseOrder.totalPrice;
                this.purchaseItems = this.purchaseOrder.purchaseItem;
            }                    
        });
    }
            
    /**
     * First search purchase order status shipped if not previus order create one
     */
    addPurchaseItem(prod: Product, userId: string): void{

        const options: Options = {
            "signature.createdBy": userId,
            status: 0      
        };

        this.purchaseOrderSubscription = MeteorObservable.subscribe<PurchaseOrder>("purchaseOrderByUserId", options).subscribe(() => {

            this.purchaseOrder = PurchaseOrders.findOne({'signature.createdBy': userId, status: 0}); 

            let flag = true;
            this.purchaseItems.forEach(element => {
                if (element.product._id == prod._id){
                    element.quantityInCart++;
                    flag = false; 
                    return;          
                }
            });

            if (flag){
                let purchaseItem: PurchaseItem = {
                    product: prod,
                    tax: this.tax,
                    quantityInCart: 1
                }
                this.purchaseItems.push(purchaseItem);
            }  

            this.totalPrice = this.totalPrice + prod.unitPrice;
            this.totalBalance = this.totalPrice + this.purchaseItems.length * this.tax;
            this.totalTax= this.purchaseItems.length * this.tax;

            Products.update(prod._id, {
                $set: {
                    quantityInStock: --prod.quantityInStock                                
                }
            });
            
            if (this.purchaseOrder){

                this.updatePurchaseOrder();              

            } else {

                this.purchaseOrder = {
                    totalBalance: this.totalBalance,
                    totalPrice: this.totalPrice,
                    totalTax: this.totalTax,
                    amountPaid: 0,
                    painOn: "",
                    paymentId: "",
                    status: Status.submitted,
                    isActive: true,
                    purchaseItem: this.purchaseItems            
                }

                PurchaseOrders.insert(this.purchaseOrder);                
            }            
        });  
    }

    /**
     * Remove item in purchase order
     */
    removePurchaseItem(prod: Product): void {
        let copyItems: Array<PurchaseItem> = []; 
        
        while(this.purchaseItems.length > 0){
            let item: PurchaseItem = this.purchaseItems.shift();
            if (item.product._id == prod._id){
                item.quantityInCart--;

                this.totalPrice = this.totalPrice - item.product.unitPrice; 
                this.totalBalance = this.totalPrice + this.purchaseItems.length * this.tax;
                this.totalTax= this.purchaseItems.length * this.tax;

                if (item.quantityInCart > 0){
                    copyItems.push(item);
                }else{
                    Products.update(item.product._id, {
                        $set: {
                            quantityInStock: ++item.product.quantityInStock                                
                        }
                    });
                }
            }else{
                copyItems.push(item);
            }            
        }

        this.purchaseItems = copyItems;

        this.updatePurchaseOrder();
    }

    /**
     * Update purchase order by id
     */
    updatePurchaseOrder(shippingAddress?: string, shippingCity?: string, shippingZip?: string, shippingState?: string, shippingCountry?: string, status?: Status, userId?: string): void {
        if (this.purchaseOrder){
            PurchaseOrders.update(this.purchaseOrder._id, {
                $set: {
                    totalPrice: this.totalPrice,
                    totalBalance: this.totalBalance,
                    totalTax: this.totalTax,
                    purchaseItem: this.purchaseItems,
                    shippingAddress: shippingAddress,
                    shippingCity: shippingCity,
                    shippingZip: shippingZip,
                    shippingState: shippingState,
                    shippingCountry: shippingCountry,
                    status: status,
                    updatedBy: userId  ,
                    updatedAt: new Date(),                  
                }                    
            });
        } else {
            console.log("Not purchase order");
        }
    }

    /**
     * Get a number of purchase items
     */
    getPurchaseItemsLenght(): boolean{
        return this.purchaseItems.length > 0;
    }

    /**
     * Get a total price representing a number in fixed-point notation
     */
    getTotalPrice(): string{
        return this.totalPrice.toFixed(2);
    } 

    /**
     * Destroy a purchase order
     */
    destroyPurchaseOrder(): void {
        if (this.purchaseOrder){
            this.updatePurchaseOrder;
            this.totalPrice = 0.00;
            this.totalTax = 0.00;
            this.totalBalance = 0.00;
            this.purchaseItems = [];
            this.purchaseOrderSubscription.unsubscribe;
        }else{
            this.totalPrice = 0.00;
            this.totalTax = 0.00;
            this.totalBalance = 0.00;
            this.purchaseItems = [];
        }
    }       
}