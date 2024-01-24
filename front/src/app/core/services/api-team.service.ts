import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { TeamAdapter, TeamModel } from '../data/models/team.model';
import { BaseService } from './base-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiTeamService extends BaseService{
  
  private baseUrl = '/api/teams';

  constructor(
    private http: HttpClient,
    private teamAdapter: TeamAdapter,
    router: Router
    ) {
      super(router);
     }

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
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
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
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
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
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
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
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  /**
   * Deletes a team from the API.
   * @param id The ID of the team to delete.
   * @returns An observable of the HTTP response.
   */
  deleteTeam(id: string): Observable<TeamModel> {
    const url = `${this.baseUrl}/delete-team?id=${id}`;
    return this.http
      .delete(url)
      .pipe(map((response: any) => this.teamAdapter.adapt(response)))
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  getTeamsByUserId(id: string) {
    const url = `${this.baseUrl}/get-teams-by-user-id?id=${id}`;
    return this.http
      .get(url)
      .pipe(
        map((response: any) =>
          response.map((item: any) => this.teamAdapter.adapt(item))
        )
      )
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

}
