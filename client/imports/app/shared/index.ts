import { DisplayNamePipe } from './display-name.pipe';
import { DisplayMainImagePipe } from "./display-main-image.pipe";
import { DisplayMainThumbsPipe } from "./display-main-thumbs.pipe";

export const SHARED_DECLARATIONS: any[] = [
  DisplayNamePipe,
  DisplayMainImagePipe,
  DisplayMainThumbsPipe
];
