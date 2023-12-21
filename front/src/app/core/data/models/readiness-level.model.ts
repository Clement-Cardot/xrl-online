import { Injectable } from '@angular/core';
import { Adapter } from '../adapter';

export class Level {
  constructor(
    public level: string,
    public shortDescription: string,
    public longDescription: string[]
  ) {}
}

export class ReadinessLevelModel {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public levels: Level[],
    public isUsed: boolean
  ) {}
}

@Injectable({
  providedIn: 'root',
})
export class ReadinessLevelAdapter implements Adapter<ReadinessLevelModel> {
  adapt(item: any): ReadinessLevelModel {
    return new ReadinessLevelModel(
      item.id,
      item.name,
      item.description,
      item.levels.map(
        (level: any) =>
          new Level(level.level, level.shortDescription, level.longDescription)
      ),
      item.isUsed
    );
  }
}
