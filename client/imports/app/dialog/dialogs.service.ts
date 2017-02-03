import { Injectable, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ConfirmDialog } from './confirm.component';
import { AlertDialog } from './alert.component';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';

@Injectable()
export class DialogsService {

    constructor(private dialog: MdDialog) { }

    public confirm(title: string, message: string, viewContainerRef: ViewContainerRef): Observable<boolean> {

        let dialogRef: MdDialogRef<ConfirmDialog>;
        let config = new MdDialogConfig();
        config.viewContainerRef = viewContainerRef;

        dialogRef = this.dialog.open(ConfirmDialog, config);

        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;

        return dialogRef.afterClosed();
    }

    public alert(title: string, message: string, flag: boolean, viewContainerRef: ViewContainerRef): Observable<boolean> {

        let dialogRef: MdDialogRef<AlertDialog>;
        let config = new MdDialogConfig();
        config.viewContainerRef = viewContainerRef;

        dialogRef = this.dialog.open(AlertDialog, config);

        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;
        dialogRef.componentInstance.flag = flag;

        return dialogRef.afterClosed();
    }
}