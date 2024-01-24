import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { BaseService } from './base-service';
import { ProjectModel } from '../data/models/project.model';
import { TranslateService } from '@ngx-translate/core';
import { ProjectReport } from '../data/models/project-report';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiFileService extends BaseService {

    protected baseUrl = "/api";

    constructor(
      private http: HttpClient,
      private translateService: TranslateService,
      router: Router
    ) {
        super(router);
    }

  downloadReport(fileType: "PDF" | "WORD" | "PPTX", id: string, projectReport: ProjectReport): Observable<Blob> {
    const url = `${this.baseUrl}/report/${id}/${fileType.toLowerCase()}`;

    const lang = this.translateService.currentLang;
    projectReport.lang = lang;

    return this.http.post(url, projectReport, {
      responseType: 'blob' as 'json',
    }) as Observable<Blob>;  
  }

  // Fonction pour déclencher le téléchargement depuis le composant
  async triggerDownload(fileType: "PDF" | "WORD" | "PPTX", project: ProjectModel, projectReport: ProjectReport) {
    const blobResponse = await firstValueFrom(this.downloadReport(fileType, project.id, projectReport))
    switch (fileType) {
      case "PDF":
        this.savePdfFile(blobResponse, project.name);
        break;
      case "WORD":
        this.saveWordFile(blobResponse, project.name);
        break;
      case "PPTX":
        this.savePPTXFile(blobResponse, project.name);
        break;
    }
  }

  // Fonction pour sauvegarder le fichier téléchargé
  private savePdfFile(response: Blob, projectName: string) {    
    const blob = new Blob([response], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = projectName + '-report-' + new Date().toLocaleDateString() + '.pdf';
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  private saveWordFile(response: Blob, projectName: string) {
    const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = projectName + '-report-' + new Date().toLocaleDateString() + '.docx';
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  private savePPTXFile(response: Blob, projectName: string) {
    const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = projectName + '-report-' + new Date().toLocaleDateString() + '.pptx';
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
