import {Pipe, PipeTransform} from '@angular/core';
import { Images } from '../../../../both/collections/images.collection';
import { Product } from '../../../../both/models/product.model';

@Pipe({
  name: 'displayMainImage'
})
export class DisplayMainImagePipe implements PipeTransform {
  transform(imageId: string) {
    if (!imageId) {
      return;
    }    
  
    let imageUrl: string;
    const found = Images.findOne(imageId);
      
    if (found) {
        imageUrl = found.path;
    }

    return imageUrl;
  }
}