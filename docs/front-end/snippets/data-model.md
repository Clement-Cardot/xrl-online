# Data Model

When retrieving data from our back-end, we end up with JSON content.<br>
We will trasnform this JSON into typescript object to make easier the use of this data.<br>
For that we use Data Model (similar to java entities).

The conversion from JSON to object is done by an Adapter defined in the same file !

exemple :

```typescript
export class UserModel {
    constructor(
        public id: string,
        public login: string,
        public firstName: string,
        public lastName: string
    ) {}
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
```