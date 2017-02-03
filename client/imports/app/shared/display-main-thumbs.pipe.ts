import {Pipe, PipeTransform} from '@angular/core';
import { Thumbs } from '../../../../both/collections/images.collection';

@Pipe({
  name: 'displayMainThumbs',
})
export class DisplayMainThumbsPipe implements PipeTransform {
  transform(thumbsIds: string []) {
    if (!thumbsIds) {
      return;
    }

    let imageUrl: string;

    if (thumbsIds.length > 0){

      const thumbs = Thumbs.findOne({
        originalId: thumbsIds[0],
        originalStore: 'images'
      });

      if (thumbs){
        imageUrl = thumbs.path;
      }
    }

    return imageUrl;
  }
}