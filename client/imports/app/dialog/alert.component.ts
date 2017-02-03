import {Component} from '@angular/core';
import {MdDialogRef} from '@angular/material';

@Component({
  selector: 'alert-dialog',
  template: `
  <p>{{title}}</p>
  <hr />
  <p><i class="material-icons">add_alert</i> {{message}} <a *ngIf="flag" [routerLink]="['login']" (click)="dialogRef.close(true)">Log in</a></p>  
  <button type="button" md-raised-button (click)="dialogRef.close(true)">OK</button>
  `
})

export class AlertDialog {
    public title: string;
    public message: string;
    public flag: boolean;

    constructor(public dialogRef: MdDialogRef<AlertDialog>){}
}