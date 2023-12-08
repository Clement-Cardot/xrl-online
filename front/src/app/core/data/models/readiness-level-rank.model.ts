import { Injectable } from "@angular/core";
import { Adapter } from "../adapter";
import { ReadinessLevelAdapter, ReadinessLevelModel } from "./readiness-level.model";

export class ReadinessLevelRankModel {
    constructor(
      public readinessLevel: ReadinessLevelModel,
      public rank: number,
      public comment: string
    ) { }
}

@Injectable({
    providedIn: 'root',
  })
  export class ReadinessLevelRankAdapter implements Adapter<ReadinessLevelRankModel> {
    constructor(private readinessLevelAdapter: ReadinessLevelAdapter) {}

    adapt(item: any): ReadinessLevelRankModel {
      return new ReadinessLevelRankModel(
        this.readinessLevelAdapter.adapt(item.readinessLevel),
        item.rank,
        item.comment
      );
    }
  }