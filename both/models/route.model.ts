import { CollectionObject } from './collection-object.model';

export interface Route extends CollectionObject {
  name: string;
  description: string;
  startRoute: Location;
  finalRoute: Location;
  price: number;
  owner?: string;
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