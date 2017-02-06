import { CollectionObject } from './collection-object.model';

export interface Route extends CollectionObject {
  name: string;
  description: string;
  startRoute: GeoLocation;
  finalRoute: GeoLocation;
  price: number;
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