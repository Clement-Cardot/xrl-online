import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProjectAdapter, ProjectModel } from '../data/models/project.model';
import { Observable, catchError, map, throwError } from 'rxjs';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class ApiProjectService extends BaseService {

  constructor(
    private http: HttpClient,
    private projectAdapter: ProjectAdapter
  ) { 
    super();
  }

  getProjects(): Observable<ProjectModel[]> {
    const url = `${this.baseUrl}/projects`;
    return this.http.get<any[]>(url)
    .pipe(
      map((response: any[]) => response.map((item: any) => this.projectAdapter.adapt(item)))
    )
    .pipe(
      catchError(super.handleError)
    );
  }

  createProject(project: ProjectModel): Observable<ProjectModel> {
    console.log("create project");
    const url = `${this.baseUrl}/project`;
    return this.http.post<any>(url, project)
    .pipe(
      map((response: any) => this.projectAdapter.adapt(response))
    )
    .pipe(
      catchError(super.handleError)
    );
  }

  updateProject(project: ProjectModel): Observable<ProjectModel> {
    const url = `${this.baseUrl}/project`;
    return this.http.put<any>(url, project)
    .pipe(
      map((response: any) => this.projectAdapter.adapt(response))
    )
    .pipe(
      catchError(super.handleError)
    );
  }

  updateProjectWithoutAssesments(project: ProjectModel): Observable<ProjectModel> {
    const url = `${this.baseUrl}/project`;
    const projectMap = project.toMap();
    delete projectMap.assessments;
    return this.http.put<any>(url, projectMap)
    .pipe(
      map((response: any) => this.projectAdapter.adapt(response))
    )
    .pipe(
      catchError(super.handleError)
    );
  }

  deleteProject(project: ProjectModel): Observable<ProjectModel> {
    const url = `${this.baseUrl}/project/${project.id}`;
    return this.http.delete<any>(url)
    .pipe(
      map((response: any) => this.projectAdapter.adapt(response))
    )
    .pipe(
      catchError(super.handleError)
    );
  }
}
