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

  /**
   * Logs in a user with the given login to the API
   * @param login The user's login.
   * @returns An Observable of the UserModel received from the API.
   * @throws An error if the API returns an error.
   */
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

  /**
   * Handles HTTP errors and returns an observable with a user-facing error message.
   * @param error - The HttpErrorResponse object to handle.
   * @returns An observable with a user-facing error message.
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
      // Return an observable with a user-facing error message.
      return throwError(() => error);
    }

    getUsers(): Observable<UserModel[]> {
      const url = `${this.baseUrl}/users`;
      return this.http.get<any[]>(url)
      .pipe(
        map((response: any[]) => response.map((item: any) => this.userAdapter.adapt(item)))
      )
      .pipe(
        catchError(this.handleError)
      );
    }

    getUserByLogin(login: string): Observable<UserModel> {
      const url = `${this.baseUrl}/user/login?login=${login}`;
      return this.http.get(url)
      .pipe(
        map((response: any) => this.userAdapter.adapt(response))
      )
      .pipe(
        catchError(this.handleError)
      );
    }

    deleteUser(id: string): Observable<any> {
      const url = `${this.baseUrl}/delete-user`;
      return this.http.delete(url, {params: {id}})
      .pipe(
        catchError(this.handleError)
      );
    }

    updateUser(user: UserModel): Observable<any> {
      const url = `${this.baseUrl}/update-user`;
      return this.http.put(url, user)
      .pipe(
        catchError(this.handleError)
      );
    }

    createUser(user: UserModel): Observable<any> {
      const url = `${this.baseUrl}/create-user`;
      return this.http.post(url, user)
      .pipe(
        catchError(this.handleError)
      );
    }
}
