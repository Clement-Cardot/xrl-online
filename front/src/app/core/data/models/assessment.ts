import { Injectable } from "@angular/core";

export class AssessmentModel {

    constructor(
        public date: Date,
        public tag: string,
        public comment: string,
        public readinessLevelRanks: any[],
    ) {}
}

@Injectable({
    providedIn: 'root',
})
export class AssessmentAdapter {

    adapt(item: any): AssessmentModel {
        return new AssessmentModel(
            new Date(item.date),
            item.tag,
            item.comment,
            item.readinessLevels,
        );
    }
}