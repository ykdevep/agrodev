/// <reference types="@types/node" />

declare module '*.html' {
  const template: string;
  export default template;
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

declare module 'meteor/jalik:roles' {
  
  interface Roles {
    start: () => void;
  }

  export var Roles;
}