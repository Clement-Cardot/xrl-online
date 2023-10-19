import { Injectable } from '@angular/core';
import { Adapter } from '../adapter';
import { UserModel } from './user.model';

export class TeamModel {
  constructor(
    public id: string,
    public name: string,
    public members: UserModel[]
  ) {}
}

@Injectable({
  providedIn: 'root',
})
export class TeamAdapter implements Adapter<TeamModel> {
  adapt(item: any): TeamModel {
    return new TeamModel(item.id, item.name, item.members);
  }
}
