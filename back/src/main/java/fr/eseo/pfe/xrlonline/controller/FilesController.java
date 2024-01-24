package fr.eseo.pfe.xrlonline.controller;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.logger.UserLogger;
import fr.eseo.pfe.xrlonline.logger.UserLoggerFactory;
import fr.eseo.pfe.xrlonline.model.dto.ProjectDTO;
import fr.eseo.pfe.xrlonline.model.dto.ReportProjectDTO;
import fr.eseo.pfe.xrlonline.service.ProjectService;
import lombok.extern.log4j.Log4j2;
import fr.eseo.pfe.xrlonline.service.reports.PdfReportService;
import fr.eseo.pfe.xrlonline.service.reports.PresentationReportService;
import fr.eseo.pfe.xrlonline.service.reports.WordReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@CrossOrigin(origins = "http://localhost:4200")
@Log4j2
@RequestMapping("/report")
public class FilesController {

  private ProjectService projectService;

  private PdfReportService pdfReportService;

  private WordReportService wordReportService;

  private PresentationReportService presentationReportService;

  public FilesController(ProjectService projectService, PdfReportService pdfReportService, WordReportService wordReportService, PresentationReportService presentationReportService) {
    this.projectService = projectService;
    this.pdfReportService = pdfReportService;
    this.wordReportService = wordReportService;
    this.presentationReportService = presentationReportService;
  }

  UserLogger logger = UserLoggerFactory.getLogger(ProjectController.class, log);

  @PostMapping("/{id}/pdf")
  public ResponseEntity<byte[]> getReportPDF(@PathVariable String id, @RequestBody ReportProjectDTO reportProjectDTO) {
    logger.logInfo("Get report for project id: %s", id);
    try {
      ProjectDTO project = projectService.getProjectById(id);
      byte[] body = pdfReportService.createPDF(project, reportProjectDTO);
      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(MediaType.APPLICATION_PDF);
      headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + project.getName() + "-report.pdf");
      return new ResponseEntity<>(body, headers, HttpStatus.OK);
    } catch (CustomRuntimeException e) {
      logger.logError("Error while trying to get pdf report with this id : %s, Error Details : %s", id, e.getMessage());
      HttpStatusCode httpCode = e.getHttpCode();
      return new ResponseEntity<>(httpCode);
    }
  }

  /**
   * WARNING : This method has not been finished due to impossibility to set absolute position of elements in a word document. (At least with Apache POI)
   * Therefore, the method is not used in the front-end for now.
   * Retrieves a WORD report for a specific project.
   *
   * @param id                The ID of the project.
   * @param reportProjectDTO  The DTO containing the report project details.
   * @return                  The ResponseEntity containing the WORD report as a byte array.
   */
  @PostMapping("/{id}/word")
  public ResponseEntity<byte[]> getReportWord(@PathVariable String id, @RequestBody ReportProjectDTO reportProjectDTO) {
    logger.logInfo("Get WORD report for project id: %s", id);
    try {
      ProjectDTO project = projectService.getProjectById(id);
      byte[] body = wordReportService.createWord(project, reportProjectDTO);
      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(new MediaType("application", "vnd.openxmlformats-officedocument.wordprocessingml.document"));
      headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + project.getName() + "-report-" + java.time.LocalDate.now().toString() + ".docx");
      return new ResponseEntity<>(body, headers, HttpStatus.OK);
    } catch (CustomRuntimeException e) {
      logger.logError("Error while trying to get word report with this id : %s, Error Details : %s", id, e.getMessage());
      HttpStatusCode httpCode = e.getHttpCode();
      return new ResponseEntity<>(httpCode);
    }
  }

  @PostMapping("/{id}/pptx")
  public ResponseEntity<byte[]> getReportPPTX(@PathVariable String id, @RequestBody ReportProjectDTO reportProjectDTO) {
    logger.logInfo("Get PowerPoint report for project id: %s", id);
    try {
      ProjectDTO project = projectService.getProjectById(id);
      byte[] body = presentationReportService.createPPTX(project, reportProjectDTO);
      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(new MediaType("application", "vnd.openxmlformats-officedocument.presentationml.presentation"));
      headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + project.getName() + "-report-" + java.time.LocalDate.now().toString() + ".pptx");
      return new ResponseEntity<>(body, headers, HttpStatus.OK);
    } catch (CustomRuntimeException e) {
      logger.logError("Error while trying to get pptx report with this id : %s, Error Details : %s", id, e.getMessage());
      HttpStatusCode httpCode = e.getHttpCode();
      return new ResponseEntity<>(httpCode);
    }
  }
}
