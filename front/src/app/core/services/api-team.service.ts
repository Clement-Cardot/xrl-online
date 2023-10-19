import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TeamAdapter, TeamModel } from '../data/models/team.model';

@Injectable({
  providedIn: 'root',
})
export class ApiTeamService {
  private baseUrl = environment.apiURL;

  constructor(private http: HttpClient, private teamAdapter: TeamAdapter) {}

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

  getAllTeams() {
    const url = `${this.baseUrl}/teams`;
    return this.http
      .get(url)
      .pipe(
        map((response: any) =>
          response.map((item: any) => this.teamAdapter.adapt(item))
        )
      )
      .pipe(catchError(this.handleError));
  }

  getTeamById(id: string) {
    const url = `${this.baseUrl}/team`;
    return this.http
      .get(url, { params: { id } })
      .pipe(map((response: any) => this.teamAdapter.adapt(response)))
      .pipe(catchError(this.handleError));
  }

  createTeam(name: string) {
    const url = `${this.baseUrl}/create-team`;
    return this.http
      .post(url, { name })
      .pipe(map((response: any) => this.teamAdapter.adapt(response)))
      .pipe(catchError(this.handleError));
  }

  updateTeam(team: TeamModel) {
    const url = `${this.baseUrl}/update-team`;
    return this.http
      .put(url, { team })
      .pipe(map((response: any) => this.teamAdapter.adapt(response)))
      .pipe(catchError(this.handleError));
  }

  deleteTeam(id: string) {
    const url = `${this.baseUrl}/delete-team`;
    console.log('deleteTeam', id);
    return this.http
      .delete(url, { params: { id } })
      .pipe(catchError(this.handleError));
  }
}
