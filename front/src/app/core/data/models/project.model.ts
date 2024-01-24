import { Injectable } from '@angular/core';
import { Adapter } from '../adapter';
import { BusinessLineAdapter, BusinessLineModel } from './business-line';
import { TeamAdapter, TeamModel } from "./team.model";
import { AssessmentAdapter, AssessmentModel } from './assessment.model';

export class ProjectModel {

    constructor(
        public id: string,
        public name: string,
        public description: string,
        public team: TeamModel,
        public businessLine: BusinessLineModel,
        public assessments: AssessmentModel[],
    ) {}

    getLastAssessment(): AssessmentModel | null {
        if (this.assessments.length === 0) return null;
        return this.getSortedAssessments()[this.assessments.length - 1];
    }

    getFirstAssessment(): AssessmentModel | null {
        if (this.assessments.length === 0) return null;
        return this.getSortedAssessments()[0];
    }

    getSortedAssessments(): AssessmentModel[] {
        return this.assessments.sort((a, b) => a.date.getTime() - b.date.getTime());
    }

    toMap(): any {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            team: this.team,
            businessLine: this.businessLine,
            assessments: this.assessments,
        }
    }

    formatDate(date: Date | undefined): string {
        if (date === null || date === undefined) return "";
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
}

@Injectable({
    providedIn: 'root',
})
export class ProjectAdapter implements Adapter<ProjectModel> {

    constructor(
        private teamAdapter: TeamAdapter,
        private businessLineAdapter: BusinessLineAdapter,
        private assessmentAdapter: AssessmentAdapter
    ) { }

    adapt(item: any): ProjectModel {
        return new ProjectModel(
            item.id,
            item.name,
            item.description,
            this.teamAdapter.adapt(item.team),
            this.businessLineAdapter.adapt(item.businessLine),
            item.assessments.map((assessment: any) => this.assessmentAdapter.adapt(assessment)),
        );
    }
}
