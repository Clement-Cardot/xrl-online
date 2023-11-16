package fr.eseo.pfe.xrlonline.service;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.ProjectDTO;
import fr.eseo.pfe.xrlonline.model.entity.Project;
import fr.eseo.pfe.xrlonline.repository.BusinessLineRepository;
import fr.eseo.pfe.xrlonline.repository.ProjectRepository;
import fr.eseo.pfe.xrlonline.repository.TeamRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

  @Autowired
  private ProjectRepository projectRepository;

  @Autowired
  private BusinessLineRepository businessLineRepository;

   @Autowired
   private TeamRepository teamRepository;

  @Autowired
  private ModelMapper modelMapper;

  public List<ProjectDTO> getProjects() {
    return projectRepository.findAll().stream()
        .map(project -> modelMapper.map(project, ProjectDTO.class))
        .toList();
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
    existingProject.setAssessments(projectDTO.getAssessments() != null ? projectDTO.getAssessments() : existingProject.getAssessments());
    System.out.println(existingProject);
    Project projectUpdated = projectRepository.save(existingProject);
    return modelMapper.map(projectUpdated, ProjectDTO.class);
  }
}
