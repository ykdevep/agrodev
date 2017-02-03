import { Meteor } from 'meteor/meteor';

export interface User extends Meteor.User {
    Roles?: string[]
    signature?: Signature;
}

interface Signature {
  creaatedAt?: Date;
  updatedAt?: Date;
  creaatedBy?: string;
  updatedBy?: string;
}