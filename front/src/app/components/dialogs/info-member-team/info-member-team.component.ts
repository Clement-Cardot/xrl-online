import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserModel } from 'src/app/core/data/models/user.model';

@Component({
  selector: 'app-info-member-team',
  templateUrl: './info-member-team.component.html',
  styleUrls: ['./info-member-team.component.scss']
})
export class InfoMemberTeamComponent {

  members!: UserModel[];

  displayedColumns: string[] = ['firstName', 'lastName'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { members: UserModel[] },
  ) {
    this.members = this.data.members;
  }

}
