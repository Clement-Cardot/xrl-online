import { Injectable } from "@angular/core";
import { Adapter } from "../adapter";
import { ReadinessLevelRankAdapter, ReadinessLevelRankModel } from "./readiness-level-rank.model";


export enum Tag {
  INITIAL = "INITIAL",
  INTERMEDIATE = "INTERMEDIATE",
  FINAL = "FINAL",
  DRAFT = "DRAFT"
}

export class AssessmentModel {
    constructor(
        public date: Date,
        public tag: Tag,
        public comment: string,
        public readinessLevelRanks: ReadinessLevelRankModel[]
    ) {}
  }
  
  @Injectable({
    providedIn: 'root',
  })
  export class AssessmentAdapter implements Adapter<AssessmentModel> {
    constructor(private readinessLevelRankAdapter: ReadinessLevelRankAdapter) {}

    adapt(item: any): AssessmentModel {
      return new AssessmentModel(
        new Date(item.date),
        item.tag,
        item.comment,
        item.readinessLevelRanks.map((readinessLevel: any) => this.readinessLevelRankAdapter.adapt(readinessLevel))
      );
    }
  }