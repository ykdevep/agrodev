import { CollectionObject } from './collection-object.model';

export interface Product extends CollectionObject {
  name: string;
  description: string;
  location: Location;
  owner?: string;
  quantityInStock: number;
  popularity: number;
  unitPrice:  number;
  oldPrice:  number;
  onSale: boolean;
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

interface Location {
  name: string;
  lat?: number;
  lng?: number;
}