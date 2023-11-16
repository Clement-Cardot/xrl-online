import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { TeamAdapter, TeamModel } from '../data/models/team.model';

@Injectable({
  providedIn: 'root',
})
export class ApiTeamService {
  private baseUrl = '/api/teams';

  constructor(
    private http: HttpClient,
    private teamAdapter: TeamAdapter
  ) {}

  /**
   * Retrieves all teams from the API.
   * @returns An observable of an array of adapted TeamModel objects.
   */
  getAllTeams() {
    const url = `${this.baseUrl}/get-all-teams`;
    return this.http
      .get(url)
      .pipe(
        map((response: any) =>
          response.map((item: any) => this.teamAdapter.adapt(item))
        )
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves a team by its ID from the API.
   * @param id The ID of the team to retrieve.
   * @returns An observable of an adapted TeamModel object.
   */
  getTeamById(id: string) {
    const url = `${this.baseUrl}/get-team-by-id/${id}`;
    return this.http
      .get(url)
      .pipe(map((response: any) => this.teamAdapter.adapt(response)))
      .pipe(catchError(this.handleError));
  }

  /**
   * Creates a new team in the API.
   * @param name The name of the new team.
   * @returns An observable of the adapted TeamModel object for the new team.
   */
  createTeam(team: TeamModel) {
    const url = `${this.baseUrl}/create-team`;
    return this.http
      .post(url, team)
      .pipe(map((response: any) => this.teamAdapter.adapt(response)))
      .pipe(catchError(this.handleError));
  }

  /**
   * Updates an existing team in the API.
   * @param team The updated TeamModel object.
   * @returns An observable of the adapted TeamModel object for the updated team.
   */
  updateTeam(team: TeamModel) {
    const url = `${this.baseUrl}/update-team`;
    return this.http
      .put(url, team)
      .pipe(map((response: any) => this.teamAdapter.adapt(response)))
      .pipe(catchError(this.handleError));
  }

  /**
   * Deletes a team from the API.
   * @param id The ID of the team to delete.
   * @returns An observable of the HTTP response.
   */
  deleteTeam(id: string) {
    const url = `${this.baseUrl}/delete-team?id=${id}`;
    console.log('deleteTeam', id);
    return this.http
      .delete(url)
      .pipe(catchError(this.handleError));
  }

  /**
   * Handles HTTP errors.
   * @param error The HttpErrorResponse object.
   * @returns An observable of the HTTP error status.
   */
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(() => error.status);
  }

}
