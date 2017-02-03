import {Component} from '@angular/core';
import {MdDialogRef} from '@angular/material';

@Component({
  selector: 'confirm-dialog',
  template: `
  <p>{{title}}</p>
  <hr />
  <p><i class="material-icons">add_alert</i> {{message}}</p>
  <button type="button" md-raised-button (click)="dialogRef.close(true)">OK</button>
  <button type="button" md-button (click)="dialogRef.close()">Cancel</button>
  `
})

export class ConfirmDialog {
    public title: string;
    public message: string;

    constructor(public dialogRef: MdDialogRef<ConfirmDialog>){}
}