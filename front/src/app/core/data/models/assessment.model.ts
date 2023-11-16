import { Injectable } from "@angular/core";
import { Adapter } from "../adapter";
import { ReadinessLevelRankAdapter, ReadinessLevelRankModel } from "./readiness-level-rank.model";


export class AssessmentModel {
    constructor(
        public timestamp: string,
        public tag: string,
        public comment: string,
        public readinessLevels: ReadinessLevelRankModel[]
    ) {}
  }
  
  @Injectable({
    providedIn: 'root',
  })
  export class AssessmentAdapter implements Adapter<AssessmentModel> {
    constructor(private readinessLevelRankAdapter: ReadinessLevelRankAdapter) {}

    adapt(item: any): AssessmentModel {
      return new AssessmentModel(
        item.timestamp,
        item.tag,
        item.comment,
        item.readinessLevels.map((readinessLevel: any) => this.readinessLevelRankAdapter.adapt(readinessLevel))
      );
    }
  }