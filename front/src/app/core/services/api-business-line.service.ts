import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BusinessLineAdapter, BusinessLineModel } from '../data/models/business-line.model';
import { throwError, Observable, catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiBusinessLineService {
  private baseUrl =  "api/businessLines";

  constructor(
    private http: HttpClient,
    private businesslineAdapter: BusinessLineAdapter
    ) { }

  /**
   * Handles HTTP errors and returns an observable with a businessLine-facing error message.
   * @param error - The HttpErrorResponse object to handle.
   * @returns An observable with a businessLine-facing error message.
   */
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong.
        console.error(
          `Backend returned code ${error.status}, body was: `, error.error);
      }
      // Return an observable with a businessLine-facing error message.
      return throwError(() => error.status);
    }

    getAllBusinessLines(): Observable<BusinessLineModel[]> {
      const url = `${this.baseUrl}/get-all-businessLines`;
      return this.http.get<any[]>(url)
      .pipe(
        map((response: any[]) => response.map((item: any) => this.businesslineAdapter.adapt(item)))
      )
      .pipe(
        catchError(this.handleError)
      );
    }

    deleteBusinessLine(id: string): Observable<any> {
      const url = `${this.baseUrl}/delete-businessLine`;
      return this.http.delete(url, {params: {id}})
      .pipe(
        catchError(this.handleError)
      );
    }

    updateBusinessLine(businessLine: BusinessLineModel): Observable<any> {
      const url = `${this.baseUrl}/update-businessLine`;
      return this.http.put(url, businessLine)
      .pipe(
        catchError(this.handleError)
      );
    }

    createBusinessLine(businessLine: BusinessLineModel): Observable<any> {
      const url = `${this.baseUrl}/create-businessLine`;
      return this.http.post(url, businessLine)
      .pipe(
        catchError(this.handleError)
      );
    }
}
