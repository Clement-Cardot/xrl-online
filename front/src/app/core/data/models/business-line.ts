import { Inject, Injectable } from "@angular/core";
import { Adapter } from "../adapter";

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