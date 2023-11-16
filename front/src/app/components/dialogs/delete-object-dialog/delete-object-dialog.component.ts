import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserModel } from 'src/app/core/data/models/user.model';

@Component({
  selector: 'app-delete-object-dialog',
  templateUrl: './delete-object-dialog.component.html',
  styleUrls: ['./delete-object-dialog.component.scss']
})
export class DeleteObjectDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {title: string, content: string},
  ) { }
}
