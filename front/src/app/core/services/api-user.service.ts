import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAdapter, UserModel } from '../data/models/user.model';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiUserService {
  private baseUrl = '/api/users';

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
   * Gets all users from the API.
   * @returns An Observable of an array of UserModel objects received from the API.
   * @throws An error if the API returns an error.
   */
  getAllUsers(): Observable<UserModel[]> {
    const url = `${this.baseUrl}/get-all-users`;
    return this.http.get<any[]>(url)
    .pipe(
      map((response: any[]) => response.map((item: any) => this.userAdapter.adapt(item)))
    )
    .pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Gets a user with the given login from the API.
   * @param login The user's login.
   * @returns An Observable of the UserModel received from the API.
   * @throws An error if the API returns an error.
   */
  getUserByLogin(login: string): Observable<UserModel> {
    const url = `${this.baseUrl}/get-user-by-login?login=${login}`;
    return this.http.get(url)
    .pipe(
      map((response: any) => this.userAdapter.adapt(response))
    )
    .pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a user with the given ID from the API.
   * @param id The ID of the user to delete.
   * @returns An Observable of any response received from the API.
   * @throws An error if the API returns an error.
   */
  deleteUser(id: string): Observable<any> {
    const url = `${this.baseUrl}/delete-user`;
    return this.http.delete(url, {params: {id}})
    .pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Updates a user with the given UserModel object in the API.
   * @param user The UserModel object representing the user to update.
   * @returns An Observable of any response received from the API.
   * @throws An error if the API returns an error.
   */
  updateUser(user: UserModel): Observable<any> {
    const url = `${this.baseUrl}/update-user`;
    return this.http.put(url, user)
    .pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Creates a new user with the given UserModel object in the API.
   * @param user The UserModel object representing the user to create.
   * @returns An Observable of any response received from the API.
   * @throws An error if the API returns an error.
   */
  createUser(user: UserModel): Observable<any> {
    const url = `${this.baseUrl}/create-user`;
    return this.http.post(url, user)
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

}
