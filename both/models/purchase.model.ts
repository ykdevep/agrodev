import { CollectionObject } from './collection-object.model';
import { Product } from './product.model';

export interface PurchaseItem extends CollectionObject {
  product: Product;
  tax: number;
  quantityInCart: number;  
}

enum	Status	{submitted, shipped, received, returned};

export interface PurchaseOrder extends CollectionObject {
  shippingAddress: string;
  shippingCity: string;
  shippingZip: string;
  shippingState: string;
  shippingCountry: string;
  totalPrice: number;
  totalTax: number;
  totalBalance: number;
  amountPaid: number;
  paymentId: string;
  painOn:  string;
  status:  Status;
  isActive: boolean;
  purchaseItem: PurchaseItem[];
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}