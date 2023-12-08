import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { HttpClient } from '@angular/common/http';
import {
  ReadinessLevelAdapter,
  ReadinessLevelModel,
} from '../data/models/readiness-level.model';
import { Observable, catchError, map } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiReadinessLevelService extends BaseService {
  protected baseUrl = '/api/readiness-levels';

  constructor(
    private http: HttpClient,
    private readinessLevelAdapter: ReadinessLevelAdapter,
    router: Router
  ) {
    super(router);
  }

  public getAllReadinessLevels(): Observable<ReadinessLevelModel[]> {
    const url = `${this.baseUrl}/get-all-readiness-levels`;
    return this.http
      .get<any[]>(url)
      .pipe(
        map((response: any[]) =>
          response.map((item: any) => this.readinessLevelAdapter.adapt(item))
        )
      )
      .pipe(catchError(super.handleError));
  }

  public getReadinessLevelById(id: string): Observable<ReadinessLevelModel> {
    const url = `${this.baseUrl}/get-readiness-level-by-id/${id}`;
    return this.http
      .get<any>(url)
      .pipe(map((response: any) => this.readinessLevelAdapter.adapt(response)))
      .pipe(catchError(super.handleError));
  }

  public createReadinessLevel(
    readinessLevel: ReadinessLevelModel
  ): Observable<ReadinessLevelModel> {
    const url = `${this.baseUrl}/create-readiness-level`;
    return this.http
      .post<any>(url, readinessLevel)
      .pipe(map((response: any) => this.readinessLevelAdapter.adapt(response)))
      .pipe(catchError(super.handleError));
  }

  public updateReadinessLevel(
    readinessLevel: ReadinessLevelModel
  ): Observable<ReadinessLevelModel> {
    const url = `${this.baseUrl}/update-readiness-level`;
    return this.http
      .put<any>(url, readinessLevel)
      .pipe(map((response: any) => this.readinessLevelAdapter.adapt(response)))
      .pipe(catchError(super.handleError));
  }

  public deleteReadinessLevel(id: string): Observable<ReadinessLevelModel> {
    const url = `${this.baseUrl}/delete-readiness-level/${id}`;
    return this.http
      .delete<any>(url)
      .pipe(map((response: any) => this.readinessLevelAdapter.adapt(response)))
      .pipe(catchError(super.handleError));
  }
}
