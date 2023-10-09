import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAdapter, UserModel } from '../data/models/user.model';
import { throwError, Observable, catchError, map } from 'rxjs';
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiUserService {
  private baseUrl =  environment.apiURL;

  constructor(
    private http: HttpClient,
    private userAdapter: UserAdapter
    ) { }

  login(login: string): Observable<UserModel> {
    const url = `${this.baseUrl}/login?login=${login}`;
    return this.http.get(url)
    .pipe(
      map((response: any) => this.userAdapter.adapt(response))
    )
    .pipe(
      catchError(this.handleError)
    );
  }

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
      // Return an observable with a user-facing error message.
      return throwError(() => error.status);
    }
}
