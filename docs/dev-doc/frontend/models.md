# Models

Models are the typescript representations of the DTOs used by the backend.</br>
In each Model file we define an adapter method that allows us to convert a JSON object to a Model object.

Here is an example with the `Business Line` model:

``` typescript title="business-line.model.ts"
export class BusinessLineModel {

    constructor(
        public id: string,
        public name: string,
    ) {}
}

@Injectable({
    providedIn: 'root',
})
export class BusinessLineAdapter implements Adapter<BusinessLineModel> {

    adapt(item: any): BusinessLineModel {
        return new BusinessLineModel(
            item.id,
            item.name,
        );
    }
}
```

Using Models with TypeScript allows us to have a better type checking and to avoid errors when we use the data from the backend.