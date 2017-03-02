/// <reference types="@types/node" />

declare module '*.html' {
  const template: string;
  export default template;
}

declare module '*.scss' {
  const style: string;
  export default style;
}

declare module '*.less' {
  const style: string;
  export default style;
}

declare module '*.css' {
  const style: string;
  export default style;
}

declare module '*.sass' {
  const style: string;
  export default style;
}
declare module 'meteor/tmeasday:publish-counts' {
  import { Mongo } from 'meteor/mongo';
  
  interface CountsObject {
    get(publicationName: string): number;
    publish(context: any, publicationName: string, cursor: Mongo.Cursor, options: any): number;
  }

  export const Counts: CountsObject;
}

declare module "meteor/jalik:ufs" {
  interface Uploader {
    start: () => void;
  }

  interface UploadFS {
      Uploader: (options: any) => Uploader;
  }
  
  export var UploadFS;
}

declare var Fake: {
    sentence(words: number): string;
}

declare module "meteor/alanning:roles" {
  export module Roles {
    function userIsInRole(id?: any,value?: any): boolean{  }
    function addUsersToRoles(id?: any,value?: any): boolean{ }
    function getRolesForUser(id?: any): boolean { }
  }
}