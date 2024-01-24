import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProjectAdapter, ProjectModel } from '../data/models/project.model';
import { Observable, catchError, map } from 'rxjs';
import { BaseService } from './base-service';
import { AssessmentModel } from '../data/models/assessment.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiProjectService extends BaseService {

  protected baseUrl = "/api/projects";

  constructor(
    private http: HttpClient,
    private projectAdapter: ProjectAdapter,
    router: Router
    ) {
      super(router);
     }

  getAllProjects(): Observable<ProjectModel[]> {
    const url = `${this.baseUrl}/get-all-projects`;
    return this.http.get<any[]>(url)
    .pipe(
      map((response: any[]) => response.map((item: any) => this.projectAdapter.adapt(item)))
    )
    .pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  getProjectById(id: string): Observable<ProjectModel> {
    const url = `${this.baseUrl}/get-project-by-id?id=${id}`;
    return this.http.get<any>(url)
    .pipe(
      map((response: any) => this.projectAdapter.adapt(response))
    )
    .pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  createProject(project: ProjectModel): Observable<ProjectModel> {
    const url = `${this.baseUrl}/create-project`;
    return this.http.post<any>(url, project)
    .pipe(
      map((response: any) => this.projectAdapter.adapt(response))
    )
    .pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  updateProject(project: ProjectModel): Observable<ProjectModel> {
    const url = `${this.baseUrl}/update-project`;
    return this.http.put<any>(url, project)
    .pipe(
      map((response: any) => this.projectAdapter.adapt(response))
    )
    .pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  deleteProject(project: ProjectModel): Observable<ProjectModel> {
    const url = `${this.baseUrl}/delete-project?id=${project.id}`;
    return this.http.delete<any>(url)
    .pipe(
      map((response: any) => this.projectAdapter.adapt(response))
    )
    .pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  getProjectsByTeamId(id: string) {
    const url = `${this.baseUrl}/get-projects-by-team-id?id=${id}`;
    return this.http
      .get(url)
      .pipe(
        map((response: any) =>
          response.map((item: any) => this.projectAdapter.adapt(item))
        )
      )
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  getProjectsByBusinessLineId(id: string) {
    const url = `${this.baseUrl}/get-projects-by-business-line-id?id=${id}`;
    return this.http
      .get(url)
      .pipe(
        map((response: any) =>
          response.map((item: any) => this.projectAdapter.adapt(item))
        )
      )
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  addNewAssessment(projectId: string, assessment: AssessmentModel): Observable<ProjectModel> {
    const url = `${this.baseUrl}/add-new-assessment?projectId=${projectId}`;
    return this.http.post<any>(url, assessment)
    .pipe(
      map((response: any) => this.projectAdapter.adapt(response))
    )
    .pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  modifyLastAssessment(projectId: string, assessment: AssessmentModel): Observable<ProjectModel> {
    const url = `${this.baseUrl}/modify-assessment?projectId=${projectId}`;
    return this.http.put<any>(url, assessment)
    .pipe(
      map((response: any) => this.projectAdapter.adapt(response))
    )
    .pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  modifyAssessmentComment(projectId: string, data: string[]): Observable<ProjectModel> {
    const url = `${this.baseUrl}/modify-assessment-comment?projectId=${projectId}`;
    return this.http.put<any>(url, data)
    .pipe(
      map((response: any) => this.projectAdapter.adapt(response))
    )
    .pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  deleteAssessment(projectId: string, assessment: AssessmentModel): Observable<ProjectModel> {
    const url = `${this.baseUrl}/delete-assessment?projectId=${projectId}`;
    return this.http.post<any>(url, assessment)
    .pipe(
      map((response: any) => this.projectAdapter.adapt(response))
    )
    .pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }
}
