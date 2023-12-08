package fr.eseo.pfe.xrlonline.controller;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.logger.UserLogger;
import fr.eseo.pfe.xrlonline.logger.UserLoggerFactory;
import fr.eseo.pfe.xrlonline.model.dto.AssessmentDTO;
import fr.eseo.pfe.xrlonline.model.dto.ProjectDTO;
import fr.eseo.pfe.xrlonline.model.entity.User;
import fr.eseo.pfe.xrlonline.service.ProjectService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@Log4j2
@RequestMapping("/projects")
public class ProjectController {

  private ProjectService projectService;

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
    logger.logInfo("REQUEST: Get project with id : {}", id);

    try {
      return ResponseEntity.ok(projectService.getProjectById(id));
    } catch (CustomRuntimeException e) {
      logger.logError("Error while trying to get project with this id : {}, Error Details : {}", id, e.getMessage());
      return new ResponseEntity<>(e.getHttpCode());
    }
  }

  @PostMapping("/create-project")
  public ResponseEntity<ProjectDTO> createProject(@RequestBody ProjectDTO projectDTO) {
    logger.logInfo("REQUEST: Create project with :", projectDTO);

    try {
      return ResponseEntity.ok(projectService.createProject(projectDTO));
    } catch (CustomRuntimeException e) {
      logger.logError("Error while trying to create project with this name : {}, Error Details : {}", projectDTO.getName(), e.getMessage());
      return new ResponseEntity<>(e.getHttpCode());
    }
  }

  @DeleteMapping("/delete-project")
  public ResponseEntity<ProjectDTO> deleteProject(@RequestParam String id) {
    logger.logInfo("REQUEST: Delete project with id :", id);

    try {
      return ResponseEntity.ok(projectService.deleteProject(id));
    } catch (CustomRuntimeException e) {
      logger.logError("Error while trying to delete project with this id : {}, Error Details : {}", id, e.getMessage());
      return new ResponseEntity<>(e.getHttpCode());
    }
  }

  @PutMapping("/update-project")
  public ResponseEntity<ProjectDTO> updateProject(@RequestBody ProjectDTO projectDTO) {
    logger.logInfo("REQUEST: Update project with :", projectDTO);

    try {
      return ResponseEntity.ok(projectService.updateProject(projectDTO));
    } catch (CustomRuntimeException e) {
      logger.logError("Error while trying to update project with this id : {}, Error Details : {}", projectDTO.getId(), e.getMessage());
      return new ResponseEntity<>(e.getHttpCode());
    }
  }

  @PostMapping("/add-new-assessment")
  public ResponseEntity<ProjectDTO> addNewAssessment(@RequestParam String projectId, @RequestBody AssessmentDTO assessmentDTO) {
    logger.logInfo("REQUEST: Add new assessment to project with id : {} and assessment : {}", projectId, assessmentDTO);

    try {
      if (this.isMemberOfProjectTeam(projectId)) {
        return ResponseEntity.ok(projectService.addNewAssessment(projectId, assessmentDTO));
      }
      else {
        throw new CustomRuntimeException(CustomRuntimeException.USER_NOT_MEMBER_OF_TEAM_PROJECT);
      }

    } catch (CustomRuntimeException e) {
      logger.logError("Error while trying to add new assessment to project with this id : {}, Error Details : {}", projectId, e.getMessage());
      return new ResponseEntity<>(e.getHttpCode());
    }
  }

  @PostMapping("/modify-last-assessment-comment")
  public ResponseEntity<ProjectDTO> modifyLastAssessmentComment(@RequestParam String projectId, @RequestBody String comment) {
    logger.logInfo("REQUEST: Modify last assessment comment in project with id : {}, comment : {}", projectId, comment);

    try {
      if (this.isMemberOfProjectTeam(projectId)) {
        return ResponseEntity.ok(projectService.modifyLastAssessmentComment(projectId, comment));
      }
      else {
        throw new CustomRuntimeException(CustomRuntimeException.USER_NOT_MEMBER_OF_TEAM_PROJECT);
      }

    } catch (CustomRuntimeException e) {
      logger.logError("Error while trying to modify last assessment comment in project with this id : {}, Error Details : {}", projectId, e.getMessage());
      return new ResponseEntity<>(e.getHttpCode());
    }
  }
  
  @GetMapping("/get-projects-by-team-id")
  public ResponseEntity<List<ProjectDTO>> getProjectsByTeamId(@RequestParam String id) {
    logger.logInfo("REQUEST: Get projects by team id with : {}", id);
    try {
      return projectService.getProjectsByTeamId(id);
    } catch (CustomRuntimeException e) {
      logger.logError("Error while trying to get projects by team id : {}, Error Details : {}", id, e.getMessage());
      return new ResponseEntity<>(e.getHttpCode());
    }
  }

  @GetMapping("/get-projects-by-business-line-id")
  public ResponseEntity<List<ProjectDTO>> getProjectsByBusinessLineId(@RequestParam String id) {
    logger.logInfo("REQUEST: Get projects by business line id with : {}", id);
    try {
      return projectService.getProjectsByBusinessLineId(id);
    } catch (CustomRuntimeException e) {
      logger.logError("Error while trying to get projects by business line id : {}, Error Details : {}", id, e.getMessage());
      return new ResponseEntity<>(e.getHttpCode());
    }
  }

  private boolean isMemberOfProjectTeam(String projectId) {

    boolean isMember = false;
    try {
      ProjectDTO projectDTO = projectService.getProjectById(projectId);
      for (User users : projectDTO.getTeam().getMembers()) {
        if (users.getLogin().equals(logger.getUsername())) {
          isMember = true;
        }
      }
    } catch (CustomRuntimeException e) {
      logger.logError("Error while trying to modify last assessment comment in project with this id : {}, Error Details : {}", projectId, e.getMessage());
    }
    return isMember;
  }

}
