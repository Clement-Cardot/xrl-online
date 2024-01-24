package fr.eseo.pfe.xrlonline.controller;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.logger.UserLogger;
import fr.eseo.pfe.xrlonline.logger.UserLoggerFactory;
import fr.eseo.pfe.xrlonline.model.dto.AssessmentDTO;
import fr.eseo.pfe.xrlonline.model.dto.ProjectDTO;
import fr.eseo.pfe.xrlonline.service.ProjectService;
import lombok.extern.log4j.Log4j2;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@Log4j2
@RequestMapping("/projects")
public class ProjectController {

  private final ProjectService projectService;

  UserLogger logger = UserLoggerFactory.getLogger(ProjectController.class, log);

  public ProjectController(ProjectService projectService) {
    this.projectService = projectService;
  }

  @GetMapping("/get-all-projects")
  public ResponseEntity<List<ProjectDTO>> getProjects() {
    logger.logInfo("REQUEST: Get all projects");

    return ResponseEntity.ok(projectService.getAllProjects());
  }

  @GetMapping("/get-project-by-id")
  public ResponseEntity<ProjectDTO> getProjectById(@RequestParam String id) {
    logger.logInfo("REQUEST: Get project with id : %s", id);

    try {
      return ResponseEntity.ok(projectService.getProjectById(id));
    } catch (CustomRuntimeException e) {
      logger.logError("Error while trying to get project with this id : %s, Error Details : %s", id, e.getMessage());
      HttpStatusCode httpCode = e.getHttpCode();
      return new ResponseEntity<>(httpCode);
    }
  }

  @PostMapping("/create-project")
  public ResponseEntity<ProjectDTO> createProject(@RequestBody ProjectDTO projectDTO) {
    logger.logInfo("REQUEST: Create project with : %s", projectDTO);

    try {
      return ResponseEntity.ok(projectService.createProject(projectDTO));
    } catch (CustomRuntimeException e) {
      logger.logError("Error while trying to create project with this name : %s, Error Details : %s", projectDTO.getName(), e.getMessage());
      HttpStatusCode httpCode = e.getHttpCode();
      return new ResponseEntity<>(httpCode);
    }
  }

  @DeleteMapping("/delete-project")
  public ResponseEntity<ProjectDTO> deleteProject(@RequestParam String id) {
    logger.logInfo("REQUEST: Delete project with id : %s", id);

    try {
      return ResponseEntity.ok(projectService.deleteProject(id));
    } catch (CustomRuntimeException e) {
      logger.logError("Error while trying to delete project with this id : %s, Error Details : %s", id, e.getMessage());
      HttpStatusCode httpCode = e.getHttpCode();
      return new ResponseEntity<>(httpCode);
    }
  }

  @PutMapping("/update-project")
  public ResponseEntity<ProjectDTO> updateProject(@RequestBody ProjectDTO projectDTO) {
    logger.logInfo("REQUEST: Update project with : %s", projectDTO);

    try {
      return ResponseEntity.ok(projectService.updateProject(projectDTO));
    } catch (CustomRuntimeException e) {
      logger.logError("Error while trying to update project with this id : %s, Error Details : %s", projectDTO.getId(), e.getMessage());
      HttpStatusCode httpCode = e.getHttpCode();
      return new ResponseEntity<>(httpCode);
    }
  }

  @PostMapping("/add-new-assessment")
  public ResponseEntity<ProjectDTO> addNewAssessment(@RequestParam String projectId, @RequestBody AssessmentDTO assessmentDTO) {
    logger.logInfo("REQUEST: Add new assessment to project with id : %s and assessment : %s", projectId, assessmentDTO);

    try {
      if (projectService.isMemberOfProjectTeam(projectId)) {
        return ResponseEntity.ok(projectService.addNewAssessment(projectId, assessmentDTO));
      }
      else {
        throw new CustomRuntimeException(CustomRuntimeException.USER_NOT_MEMBER_OF_TEAM_PROJECT);
      }

    } catch (CustomRuntimeException e) {
      logger.logError("Error while trying to add new assessment to project with this id : %s, Error Details : %s", projectId, e.getMessage());
      HttpStatusCode httpCode = e.getHttpCode();
      return new ResponseEntity<>(httpCode);
    }
  }

  @PutMapping("/modify-assessment")
  public ResponseEntity<ProjectDTO> modifyAssessment(@RequestParam String projectId, @RequestBody AssessmentDTO assessmentDTO) {
    logger.logInfo("REQUEST: Modify assessment of project with id : %s and assessment : %s", projectId, assessmentDTO);

    try {
      if (projectService.isMemberOfProjectTeam(projectId)) {
        return ResponseEntity.ok(projectService.modifyAssessment(projectId, assessmentDTO));
      }
      else {
        throw new CustomRuntimeException(CustomRuntimeException.USER_NOT_MEMBER_OF_TEAM_PROJECT);
      }

    } catch (CustomRuntimeException e) {
      logger.logError("Error while trying to modify last assessment of project with this id : %s, Error Details : %s", projectId, e.getMessage());
      HttpStatusCode httpCode = e.getHttpCode();
      return new ResponseEntity<>(httpCode);
    }
  }

  @PutMapping("/modify-assessment-comment")
  public ResponseEntity<ProjectDTO> modifyAssessmentComment(@RequestParam String projectId, @RequestBody String[] data) {
    logger.logInfo("REQUEST: Modify last assessment comment in project with id : %s, comment : %s, assessmentIndex : %s", projectId, data[0], data[1]);

    try {
      if (projectService.isMemberOfProjectTeam(projectId)) {
        return ResponseEntity.ok(projectService.modifyAssessmentComment(projectId, data));
      }
      else {
        throw new CustomRuntimeException(CustomRuntimeException.USER_NOT_MEMBER_OF_TEAM_PROJECT);
      }

    } catch (CustomRuntimeException e) {
      logger.logError("Error while trying to modify assessment comment in project with this id : %s, Error Details : %s", projectId, e.getMessage());
      HttpStatusCode httpCode = e.getHttpCode();
      return new ResponseEntity<>(httpCode);
    }
  }
  
  @GetMapping("/get-projects-by-team-id")
  public ResponseEntity<List<ProjectDTO>> getProjectsByTeamId(@RequestParam String id) {
    logger.logInfo("REQUEST: Get projects by team id with : %s", id);
    try {
      return projectService.getProjectsByTeamId(id);
    } catch (CustomRuntimeException e) {
      logger.logError("Error while trying to get projects by team id : %s, Error Details : %s", id, e.getMessage());
      HttpStatusCode httpCode = e.getHttpCode();
      return new ResponseEntity<>(httpCode);
    }
  }

  @GetMapping("/get-projects-by-business-line-id")
  public ResponseEntity<List<ProjectDTO>> getProjectsByBusinessLineId(@RequestParam String id) {
    logger.logInfo("REQUEST: Get projects by business line id with : %s", id);
    try {
      return projectService.getProjectsByBusinessLineId(id);
    } catch (CustomRuntimeException e) {
      logger.logError("Error while trying to get projects by business line id : %s, Error Details : %s", id, e.getMessage());
      HttpStatusCode httpCode = e.getHttpCode();
      return new ResponseEntity<>(httpCode);
    }
  }

  @PostMapping("/delete-assessment")
  public ResponseEntity<ProjectDTO> deleteAssessment(@RequestParam String projectId, @RequestBody AssessmentDTO assessmentDTO) {
    logger.logInfo("REQUEST: Delete assessment to project with id : %s and assessment : %s", projectId, assessmentDTO);

    try {
      if (projectService.isAdmin()) {
        return ResponseEntity.ok(projectService.deleteAssessment(projectId, assessmentDTO));
      }
      else {
        throw new CustomRuntimeException(CustomRuntimeException.USER_NOT_ADMIN);
      }

    } catch (CustomRuntimeException e) {
      logger.logError("Error while trying to add new assessment to project with this id : %s, Error Details : %s", projectId, e.getMessage());
      HttpStatusCode httpCode = e.getHttpCode();
      return new ResponseEntity<>(httpCode);
    }
  }

}
