import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {Subject, Subscription, Observable} from "rxjs";

import {MdSnackBar} from '@angular/material';

import {MeteorObservable} from "meteor-rxjs";

import {upload} from '../../../../both/methods/images.methods';
import {Thumb} from "../../../../both/models/image.model";
import {Thumbs} from "../../../../both/collections/images.collection";

import template from './product-upload.component.html';

@Component({
  selector: 'product-upload',
  template
})
export class ProductUploadComponent implements OnInit {

  fileIsOver: boolean = false;
  uploading: boolean = false;
  filesArray: string[] = [];
  files: Subject<string[]> = new Subject<string[]>();
  thumbsSubscription: Subscription;
  thumbs: Observable<Thumb[]>;
  @Output() onFile: EventEmitter<string> = new EventEmitter<string>();

  constructor(private snackBar: MdSnackBar,) {}

  ngOnInit() {
      
    this.files.subscribe((filesArray) => {
      MeteorObservable.autorun().subscribe(() => {
        if (this.thumbsSubscription) {
          this.thumbsSubscription.unsubscribe();
          this.thumbsSubscription = undefined;
        }

        this.thumbsSubscription = MeteorObservable.subscribe("thumbs", filesArray).subscribe(() => {
          this.thumbs = Thumbs.find({
            originalStore: 'images',
            originalId: {
              $in: filesArray
            }
          }).zone();
        });
      });
    });
  }

  fileOver(fileIsOver: boolean): void {
    this.fileIsOver = fileIsOver;
    this.snackBar.open('Upload file is over', 'X');
  }

  onFileDrop(file: File): void {
    this.uploading = true;
    this.snackBar.open('Uploading...', 'X', {duration: 1200});
    
    upload(file)
      .then((result) => {
        this.uploading = false;
        this.addFile(result);
      })
      .catch((error) => {
        this.uploading = false;
        this.snackBar.open('Something went wrong!', 'X', {duration: 1200});
      });
  }

  addFile(file) {
    this.filesArray.push(file._id);
    this.files.next(this.filesArray);
    this.onFile.emit(file._id);
  }

  reset() {
    this.filesArray = [];
    this.files.next(this.filesArray);
  }
}