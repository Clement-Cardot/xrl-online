package fr.eseo.pfe.xrlonline.service;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.AssessmentDTO;
import fr.eseo.pfe.xrlonline.model.dto.ProjectDTO;
import fr.eseo.pfe.xrlonline.model.entity.Assessment;
import fr.eseo.pfe.xrlonline.model.entity.BusinessLine;
import fr.eseo.pfe.xrlonline.model.entity.Project;
import fr.eseo.pfe.xrlonline.model.entity.Team;
import fr.eseo.pfe.xrlonline.repository.BusinessLineRepository;
import fr.eseo.pfe.xrlonline.repository.ProjectRepository;
import fr.eseo.pfe.xrlonline.repository.TeamRepository;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

  private final ProjectRepository projectRepository;

  private final BusinessLineRepository businessLineRepository;

  private final TeamRepository teamRepository;

  private final ModelMapper modelMapper;

  public ProjectService(ProjectRepository projectRepository, BusinessLineRepository businessLineRepository, TeamRepository teamRepository, ModelMapper modelMapper) {
    this.projectRepository = projectRepository;
    this.businessLineRepository = businessLineRepository;
    this.teamRepository = teamRepository;
    this.modelMapper = modelMapper;
  }

  public List<ProjectDTO> getAllProjects() {
    return projectRepository.findAll().stream()
        .map(project -> modelMapper.map(project, ProjectDTO.class))
        .collect(Collectors.toList());
  }

  public ProjectDTO getProjectById(String id) throws CustomRuntimeException {
    Project project = projectRepository.findById(id)
        .orElseThrow(() -> new CustomRuntimeException(CustomRuntimeException.PROJECT_NOT_FOUND));
    return modelMapper.map(project, ProjectDTO.class);
  }

  public ProjectDTO createProject(ProjectDTO projectDTO) throws CustomRuntimeException {
    if (projectDTO.getName() == null) {
      throw new CustomRuntimeException(CustomRuntimeException.PROJECT_NAME_NULL);
    }
    if (projectDTO.getBusinessLine() == null) {
      throw new CustomRuntimeException(CustomRuntimeException.PROJECT_BUSINESS_LINE_NULL);
    }
    if (projectDTO.getTeam() == null) {
      throw new CustomRuntimeException(CustomRuntimeException.PROJECT_TEAM_NULL);
    }
    Project projectToCreate = modelMapper.map(projectDTO, Project.class);
    projectToCreate.setId(null);
    if (projectRepository.findByName(projectToCreate.getName()) != null) {
      throw new CustomRuntimeException(CustomRuntimeException.PROJECT_NAME_ALREADY_EXISTS);
    }
    if (businessLineRepository.findById(projectToCreate.getBusinessLine().getId()).isEmpty()) {
      throw new CustomRuntimeException(CustomRuntimeException.BUSINESS_LINE_NOT_FOUND);
    }
    if (teamRepository.findById(projectToCreate.getTeam().getId()).isEmpty()) {
      throw new CustomRuntimeException(CustomRuntimeException.TEAM_NOT_FOUND);
    }

    if (projectToCreate.getDescription() == null) {
      projectToCreate.setDescription("");
    }
    if (projectToCreate.getAssessments() == null) {
      projectToCreate.setAssessments(List.of());
    }
    Project projectCreated = projectRepository.save(projectToCreate);
    return modelMapper.map(projectCreated, ProjectDTO.class);
  }

  public ProjectDTO deleteProject(String id) throws CustomRuntimeException {
    Project projectToDelete = projectRepository.findById(id)
        .orElseThrow(() -> new CustomRuntimeException(CustomRuntimeException.PROJECT_NOT_FOUND));
    projectRepository.delete(projectToDelete);
    return modelMapper.map(projectToDelete, ProjectDTO.class);
  }

  public ProjectDTO updateProject(ProjectDTO projectDTO) throws CustomRuntimeException {
    Project existingProject = projectRepository.findById(projectDTO.getId())
        .orElseThrow(() -> new CustomRuntimeException(CustomRuntimeException.PROJECT_NOT_FOUND));

    if (projectDTO.getName() != null && !projectDTO.getName().equals(existingProject.getName())
        && projectRepository.findByName(projectDTO.getName()) != null) {
      throw new CustomRuntimeException(CustomRuntimeException.PROJECT_NAME_ALREADY_EXISTS);
    }
    if (projectDTO.getBusinessLine() != null && businessLineRepository.findById(projectDTO.getBusinessLine().getId()).isEmpty()) {
      throw new CustomRuntimeException(CustomRuntimeException.BUSINESS_LINE_NOT_FOUND);
    }
    if (projectDTO.getTeam() != null && teamRepository.findById(projectDTO.getTeam().getId()).isEmpty()) {
      throw new CustomRuntimeException(CustomRuntimeException.TEAM_NOT_FOUND);
    }

    existingProject.setName(projectDTO.getName() != null ? projectDTO.getName() : existingProject.getName());
    existingProject.setDescription(projectDTO.getDescription() != null ? projectDTO.getDescription() : existingProject.getDescription());
    existingProject.setBusinessLine(projectDTO.getBusinessLine() != null ? projectDTO.getBusinessLine() : existingProject.getBusinessLine());
    existingProject.setTeam(projectDTO.getTeam() != null ? projectDTO.getTeam() : existingProject.getTeam());

    if (projectDTO.getAssessments() != null) {
      List<Assessment> assessments = new ArrayList<>();
      for (AssessmentDTO assessment : projectDTO.getAssessments()) {
        assessments.add(modelMapper.map(assessment, Assessment.class));
      }
      existingProject.setAssessments(assessments);
    }
    
    Project projectUpdated = projectRepository.save(existingProject);
    return modelMapper.map(projectUpdated, ProjectDTO.class);
  }

  public ProjectDTO addNewAssessment(String projectId, AssessmentDTO assessmentDTO) throws CustomRuntimeException {
    Project existingProject = projectRepository.findById(projectId)
        .orElseThrow(() -> new CustomRuntimeException(CustomRuntimeException.PROJECT_NOT_FOUND));
    existingProject.getAssessments().add(modelMapper.map(assessmentDTO, Assessment.class));
    Project projectUpdated = projectRepository.save(existingProject);
    return modelMapper.map(projectUpdated, ProjectDTO.class);
  }

  public ProjectDTO modifyLastAssessmentComment(String projectId, String comment) throws CustomRuntimeException {
    Project existingProject = projectRepository.findById(projectId)
            .orElseThrow(() -> new CustomRuntimeException(CustomRuntimeException.PROJECT_NOT_FOUND));

    if (comment == null) {
      throw new CustomRuntimeException(CustomRuntimeException.PROJECT_LAST_ASSESSMENT_COMMENT_NULL);
    }
    else if (existingProject.getAssessments().isEmpty()) {
      throw new CustomRuntimeException(CustomRuntimeException.PROJECT_ASSESSMENT_LIST_IS_EMPTY);
    }

    existingProject.getAssessments().get(existingProject.getAssessments().size() - 1).setComment(comment);

    Project projectUpdated = projectRepository.save(existingProject);
    return modelMapper.map(projectUpdated, ProjectDTO.class);
  }

  public ResponseEntity<List<ProjectDTO>> getProjectsByTeamId(String id) throws CustomRuntimeException {
    Team team = teamRepository.findById(id).orElse(null);
    if (team == null) {
      throw new CustomRuntimeException(CustomRuntimeException.TEAM_NOT_FOUND);
    }
    List<ProjectDTO> projectsDTO = projectRepository.findByTeam(team).stream()
            .map(project -> modelMapper.map(project, ProjectDTO.class))
            .collect(Collectors.toList());
    return ResponseEntity.ok(projectsDTO);
  }

    public ResponseEntity<List<ProjectDTO>> getProjectsByBusinessLineId(String id) throws CustomRuntimeException {
      BusinessLine businessLine = businessLineRepository.findById(id).orElse(null);
      if (businessLine == null) {
          throw new CustomRuntimeException(CustomRuntimeException.BUSINESS_LINE_NOT_FOUND);
      }
      List<ProjectDTO> projectsDTO = projectRepository.findByBusinessLine(businessLine).stream()
              .map(project -> modelMapper.map(project, ProjectDTO.class))
              .collect(Collectors.toList());
        return ResponseEntity.ok(projectsDTO);
    }
}
