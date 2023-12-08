import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BusinessLineAdapter, BusinessLineModel } from '../data/models/business-line.model';
import { Observable, catchError, map } from 'rxjs';
import { BaseService } from './base-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiBusinessLineService extends BaseService{
  
  private baseUrl =  "api/businessLines";

  constructor(
    private http: HttpClient,
    private businesslineAdapter: BusinessLineAdapter,
    router: Router
    ) {
      super(router);
     }

    getAllBusinessLines(): Observable<BusinessLineModel[]> {
      const url = `${this.baseUrl}/get-all-businessLines`;
      return this.http.get<any[]>(url)
      .pipe(
        map((response: any[]) => response.map((item: any) => this.businesslineAdapter.adapt(item)))
      )
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
    }

    deleteBusinessLine(id: string): Observable<any> {
      const url = `${this.baseUrl}/delete-businessLine`;
      return this.http.delete(url, {params: {id}})
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
    }

    updateBusinessLine(businessLine: BusinessLineModel): Observable<any> {
      const url = `${this.baseUrl}/update-businessLine`;
      return this.http.put(url, businessLine)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
    }

    createBusinessLine(businessLine: BusinessLineModel): Observable<any> {
      const url = `${this.baseUrl}/create-businessLine`;
      return this.http.post(url, businessLine)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
    }
}
