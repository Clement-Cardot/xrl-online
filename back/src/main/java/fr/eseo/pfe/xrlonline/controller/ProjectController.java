package fr.eseo.pfe.xrlonline.controller;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.ProjectDTO;
import fr.eseo.pfe.xrlonline.service.ProjectService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class ProjectController {

  @Autowired
  private ProjectService projectService;

  Logger logger = LoggerFactory.getLogger(ProjectController.class);

  @GetMapping("/projects")
  public ResponseEntity<List<ProjectDTO>> getProjects() {
    logger.info("REQUEST: Get all projects");

    return ResponseEntity.ok(projectService.getProjects());
  }

  @PostMapping("/project")
  public ResponseEntity<ProjectDTO> createProject(@RequestBody ProjectDTO projectDTO) {
    logger.info("REQUEST: Create project");

    try {
      return ResponseEntity.ok(projectService.createProject(projectDTO));
    } catch (CustomRuntimeException e) {
      logger.error("Error while trying to create project with this name : {}, Error Details : {}", projectDTO.getName(), e.getMessage());
      return new ResponseEntity<>(e.getHttpCode());
    }
  }

  @DeleteMapping("/project/{id}")
  public ResponseEntity<ProjectDTO> deleteProject(@PathVariable String id) {
    logger.info("REQUEST: Delete project");

    try {
      return ResponseEntity.ok(projectService.deleteProject(id));
    } catch (CustomRuntimeException e) {
      logger.error("Error while trying to delete project with this id : {}, Error Details : {}", id, e.getMessage());
      return new ResponseEntity<>(e.getHttpCode());
    }
  }

  @PutMapping("/project")
  public ResponseEntity<ProjectDTO> updateProject(@RequestBody ProjectDTO projectDTO) {
    logger.info("REQUEST: Update project");

    try {
      return ResponseEntity.ok(projectService.updateProject(projectDTO));
    } catch (CustomRuntimeException e) {
      logger.error("Error while trying to update project with this id : {}, Error Details : {}", projectDTO.getId(), e.getMessage());
      return new ResponseEntity<>(e.getHttpCode());
    }
  }

}
