import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAdapter, UserModel } from '../data/models/user.model';
import { Observable, catchError, map } from 'rxjs';
import { BaseService } from './base-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiUserService extends BaseService{
  private baseUrl = '/api/users';

  constructor(
    private http: HttpClient,
    private userAdapter: UserAdapter,
    router: Router
    ) {
      super(router);
     }

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
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  /**
   * Checks the connection status.
   * @returns An Observable that emits a boolean indicating the connection status.
   */
  checkConnexion(): Observable<boolean> {
    const url = `${this.baseUrl}/check-connexion`;
    return this.http.get(url)
    .pipe(
      map((response: any) => response)
    )
    .pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
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
      catchError((error: HttpErrorResponse) => this.handleError(error))
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
      catchError((error: HttpErrorResponse) => this.handleError(error))
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
      catchError((error: HttpErrorResponse) => this.handleError(error))
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
      catchError((error: HttpErrorResponse) => this.handleError(error))
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
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

}
