import { Injectable } from "@angular/core";
import { Adapter } from "../adapter";

class Level {
    constructor(
        public name: string,
        public shortDescription: string,
        public longDescription: string
    ) { }
}

export class ReadinessLevelModel {
    constructor(
        public name: string, 
        public description: string, 
        public levels: Level[]
    ) { }
}

export interface ReadinessLevel {
    level: string,
    shortDescription: string,
    longDescription: string
}

@Injectable({
    providedIn: 'root',
  })
  export class ReadinessLevelAdapter implements Adapter<ReadinessLevelModel> {
    adapt(item: any): ReadinessLevelModel {
      return new ReadinessLevelModel(
        item.name,
        item.description,
        item.levels.map((level: any) => new Level(level.name, level.shortDescription, level.longDescription))
      );
    }
  }