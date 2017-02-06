import { CollectionObject } from './collection-object.model';

export interface Product extends CollectionObject {
  name: string;
  description: string;
  location: GeoLocation;
  quantityInStock: number;
  popularity: number;
  unitPrice:  number;
  onSale: boolean;  
  oldsPrice?:  number[];
  tags?: string[];
  images?: string[];
  signature?: Signature;
}

interface Signature {
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface GeoLocation {
  name: string;
  lat?: number;
  lng?: number;
}