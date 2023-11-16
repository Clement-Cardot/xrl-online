import { Injectable } from "@angular/core";
import { Adapter } from "../adapter";

export class UserModel {
    constructor(
        public id: string,
        public login: string,
        public firstName: string,
        public lastName: string
    ) {}

    public isAdmin(): boolean {
        return this.login === "admin";
    }
}

@Injectable({
    providedIn: 'root'
})
export class UserAdapter implements Adapter<UserModel> {
    adapt(item: any): UserModel {
        return new UserModel(
            item.id,
            item.login,
            item.firstName,
            item.lastName
        );
    }
}
