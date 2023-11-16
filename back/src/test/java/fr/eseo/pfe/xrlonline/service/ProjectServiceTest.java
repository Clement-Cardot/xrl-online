package fr.eseo.pfe.xrlonline.service;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.ProjectDTO;
import fr.eseo.pfe.xrlonline.model.entity.Assessment;
import fr.eseo.pfe.xrlonline.model.entity.BusinessLine;
import fr.eseo.pfe.xrlonline.model.entity.Project;
import fr.eseo.pfe.xrlonline.model.entity.Team;
import fr.eseo.pfe.xrlonline.repository.BusinessLineRepository;
import fr.eseo.pfe.xrlonline.repository.ProjectRepository;
import fr.eseo.pfe.xrlonline.repository.TeamRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest
public class ProjectServiceTest {

  @MockBean
  private ProjectRepository projectRepository;

  @MockBean
  private BusinessLineRepository businessLineRepository;

  @MockBean
  private TeamRepository teamRepository;

  @Autowired
  private ProjectService projectService;

  @Autowired
  private ModelMapper modelMapper;


  @Test
  public void testGetProjects() {
    // Arrange
    List<Project> projects = new ArrayList<>();
    Project project1 = new Project();
    project1.setId("1");
    project1.setName("Project 1");
    Project project2 = new Project();
    project2.setId("2");
    project2.setName("Project 2");
    projects.add(project1);
    projects.add(project2);

    when(projectRepository.findAll()).thenReturn(projects);

    // Act
    List<ProjectDTO> result = projectService.getProjects();
    System.out.println(result);

    // Assert
    assertEquals(2, result.size());
    assertEquals("1", result.get(0).getId());
    assertEquals("Project 1", result.get(0).getName());
    assertEquals("2", result.get(1).getId());
    assertEquals("Project 2", result.get(1).getName());

    verify(projectRepository).findAll();
  }

  // Returns an empty list when projectRepository has no projects
  @Test
  public void testGetProjectsWithEmptyList() {
    // Arrange
    when(projectRepository.findAll()).thenReturn(new ArrayList<>());

    // Act
    List<ProjectDTO> result = projectService.getProjects();

    // Assert
    assertTrue(result.isEmpty());

    verify(projectRepository).findAll();
  }

  @Test
  public void testCreateValidProject() {
    // Arrange
    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setName("Test Project");
    BusinessLine businessLine = new BusinessLine();
    businessLine.setId("1");
    projectDTO.setBusinessLine(businessLine);
    Team team = new Team();
    team.setId("1");
    projectDTO.setTeam(team);

    Project projectToCreate = new Project();
    projectToCreate.setName("Test Project");
    projectToCreate.setBusinessLine(businessLine);
    projectToCreate.setTeam(team);
    projectToCreate.setDescription("");
    projectToCreate.setAssessments(List.of());

    when(projectRepository.findByName("Test Project")).thenReturn(null);
    when(businessLineRepository.findById("1")).thenReturn(Optional.of(businessLine));
    when(teamRepository.findById("1")).thenReturn(Optional.of(team));
    when(projectRepository.save(projectToCreate)).thenReturn(projectToCreate);

    // Act
    ProjectDTO result = null;
    try {
      result = projectService.createProject(projectDTO);
    } catch (CustomRuntimeException e) {
      fail("Should not throw exception", e);
    }

    // Assert
    assertEquals(result.getName(), projectDTO.getName());
    assertEquals(result.getBusinessLine(), projectDTO.getBusinessLine());
    assertEquals(result.getTeam(), projectDTO.getTeam());
    assertEquals(result.getDescription(), "");
    assertEquals(result.getAssessments(), List.of());
    verify(projectRepository).save(projectToCreate);
  }

  @Test
  public void testCreateProjectWithProjectNameNull() {
    // Arrange
    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setBusinessLine(new BusinessLine());
    projectDTO.getBusinessLine().setId("1");
    projectDTO.setTeam(new Team());
    projectDTO.getTeam().setId("1");

    // Act & Assert
    assertThrows(CustomRuntimeException.class,
        () -> projectService.createProject(projectDTO),
        CustomRuntimeException.PROJECT_NAME_NULL);
  }

  @Test
  public void testCreateProjectWithBusinessLineNull() {
    // Arrange
    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setName("Test Project");
    projectDTO.setTeam(new Team());

    // Act & Assert
    assertThrows(CustomRuntimeException.class,
        () -> projectService.createProject(projectDTO),
        CustomRuntimeException.PROJECT_BUSINESS_LINE_NULL);
  }

  @Test
  public void testCreateProjectWithTeamNull() {
    // Arrange
    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setName("Test Project");
    projectDTO.setBusinessLine(new BusinessLine());

    // Act & Assert
    assertThrows(CustomRuntimeException.class,
        () -> projectService.createProject(projectDTO),
        CustomRuntimeException.PROJECT_TEAM_NULL);
  }

  @Test
  public void testCreateProjectWithProjectNameAlreadyExist() {
    // Arrange
    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setName("Test Project");
    BusinessLine businessLine = new BusinessLine();
    businessLine.setId("1");
    projectDTO.setBusinessLine(businessLine);
    Team team = new Team();
    team.setId("1");
    projectDTO.setTeam(team);

    Project projectToCreate = new Project();
    projectToCreate.setName("Test Project");
    projectToCreate.setBusinessLine(businessLine);
    projectToCreate.setTeam(team);
    projectToCreate.setDescription("");
    projectToCreate.setAssessments(List.of());

    when(projectRepository.findByName("Test Project")).thenReturn(projectToCreate);

    // Act and Assert
    assertThrows(CustomRuntimeException.class,
        () -> projectService.createProject(projectDTO),
        CustomRuntimeException.PROJECT_NAME_ALREADY_EXISTS);
  }

  @Test
  public void testCreateProjectWithBusinessLineNotFound() {
    // Arrange
    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setName("Test Project");
    BusinessLine businessLine = new BusinessLine();
    businessLine.setId("1");
    projectDTO.setBusinessLine(businessLine);
    Team team = new Team();
    team.setId("1");
    projectDTO.setTeam(team);

    when(projectRepository.findByName("Test Project")).thenReturn(null);
    when(businessLineRepository.findById("1")).thenReturn(Optional.empty());

    // Act and Assert
    assertThrows(CustomRuntimeException.class,
        () -> projectService.createProject(projectDTO),
        CustomRuntimeException.BUSINESS_LINE_NOT_FOUND);
  }

  @Test
  public void testCreateProjectWithTeamNotFound() {
    // Arrange
    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setName("Test Project");
    BusinessLine businessLine = new BusinessLine();
    businessLine.setId("1");
    projectDTO.setBusinessLine(businessLine);
    Team team = new Team();
    team.setId("1");
    projectDTO.setTeam(team);

    when(projectRepository.findByName("Test Project")).thenReturn(null);
    when(businessLineRepository.findById("1")).thenReturn(Optional.of(businessLine));
    when(teamRepository.findById("1")).thenReturn(Optional.empty());

    // Act and Assert
    assertThrows(CustomRuntimeException.class,
        () -> projectService.createProject(projectDTO),
        CustomRuntimeException.TEAM_NOT_FOUND);
  }

  @Test
  public void testDeleteValidProject() {
    // Arrange
    String projectId = "validId";
    ProjectDTO expectedDeletedProject = new ProjectDTO();
    expectedDeletedProject.setId(projectId);

    Project projectToDelete = new Project();
    projectToDelete.setId(projectId);

    when(projectRepository.findById(projectId)).thenReturn(Optional.of(projectToDelete));

    // Act
    ProjectDTO deletedProject = null;
    try {
      deletedProject = projectService.deleteProject(projectId);
    } catch (CustomRuntimeException e) {
      fail("Should not throw exception", e);
    }

    // Assert
    verify(projectRepository).delete(projectToDelete);
    assertEquals(expectedDeletedProject, deletedProject);
  }

  @Test
  public void testDeleteNonExistingProject() {
    // Arrange
    String projectId = "nonexistentId";

    when(projectRepository.findById(projectId)).thenReturn(Optional.empty());

    // Act and Assert
    assertThrows(CustomRuntimeException.class,
        () -> projectService.deleteProject(projectId),
        CustomRuntimeException.PROJECT_NOT_FOUND);
  }

  @Test
  public void testDeleteProjectWithNullId() {
    // Arrange
    String projectId = null;

    // Act and Assert
    assertThrows(CustomRuntimeException.class,
        () -> projectService.deleteProject(projectId),
        CustomRuntimeException.PROJECT_NOT_FOUND);
  }

  @Test
  public void testUpdateAllFieldOfProject() {
    // Arrange
    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setId("1");
    projectDTO.setName("New Name");
    projectDTO.setDescription("New Description");
    BusinessLine businessLine = new BusinessLine();
    businessLine.setId("1");
    businessLine.setName("New Business Line");
    projectDTO.setBusinessLine(businessLine);
    Team team = new Team();
    team.setId("1");
    team.setName("New Team");
    projectDTO.setTeam(team);
    List<Assessment> assessments = new ArrayList<>();
    Assessment assessment = new Assessment();
    assessment.setComment("New comment");
    assessments.add(assessment);
    projectDTO.setAssessments(assessments);

    Project existingProject = new Project();
    existingProject.setId("1");
    existingProject.setName("Old Name");
    existingProject.setDescription("Old Description");
    BusinessLine oldBusinessLine = new BusinessLine();
    oldBusinessLine.setId("1");
    oldBusinessLine.setName("Old Business Line");
    existingProject.setBusinessLine(oldBusinessLine);
    Team oldTeam = new Team();
    oldTeam.setId("1");
    oldTeam.setName("Old Team");
    existingProject.setTeam(oldTeam);
    List<Assessment> oldAssessments = new ArrayList<>();
    Assessment oldAssessment = new Assessment();
    oldAssessment.setComment("Old comment");
    oldAssessments.add(oldAssessment);
    existingProject.setAssessments(oldAssessments);

    Project saveProject = modelMapper.map(projectDTO, Project.class);

    when(projectRepository.findById("1")).thenReturn(Optional.of(existingProject));
    when(projectRepository.findByName("New Name")).thenReturn(null);
    when(businessLineRepository.findById("1")).thenReturn(Optional.of(businessLine));
    when(teamRepository.findById("1")).thenReturn(Optional.of(team));
    when(projectRepository.save(saveProject)).thenReturn(saveProject);

    // Act
    ProjectDTO updatedProject = null;
    try {
      updatedProject = projectService.updateProject(projectDTO);
    } catch (CustomRuntimeException e) {
      fail("Should not throw exception", e);
    }

    // Assert
    assertEquals("New Name", updatedProject.getName());
    assertEquals("New Description", updatedProject.getDescription());
    assertEquals("New Business Line", updatedProject.getBusinessLine().getName());
    assertEquals("New Team", updatedProject.getTeam().getName());
    assertEquals(1, updatedProject.getAssessments().size());
    assertEquals("New comment", updatedProject.getAssessments().get(0).getComment());
  }

  @Test
  public void testUpdateProjectWithNullId() {
    // Arrange
    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setName("New Name");

    // Act
    assertThrows(CustomRuntimeException.class,
        () -> projectService.updateProject(projectDTO),
        CustomRuntimeException.PROJECT_NOT_FOUND);

    // Assert
    verify(projectRepository, never()).findById(anyString());
  }

  @Test
  public void testUpdateNonExistingProject() {
    // Arrange
    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setId("1");
    projectDTO.setName("New Name");

    when(projectRepository.findById("1")).thenReturn(Optional.empty());

    // Act
    assertThrows(CustomRuntimeException.class,
        () -> projectService.updateProject(projectDTO),
        CustomRuntimeException.PROJECT_NOT_FOUND);

    // Assert
    verify(projectRepository).findById("1");
  }

  @Test
  public void testUpdateProjectWithAlreadyExistingName() {
    // Arrange
    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setId("1");
    projectDTO.setName("New Name");

    Project existingProject = new Project();
    existingProject.setId("1");
    existingProject.setName("Old Name");

    when(projectRepository.findById("1")).thenReturn(Optional.of(existingProject));
    when(projectRepository.findByName("New Name")).thenReturn(new Project());

    // Act
    assertThrows(CustomRuntimeException.class,
        () -> projectService.updateProject(projectDTO),
        CustomRuntimeException.PROJECT_NAME_ALREADY_EXISTS);

    // Assert
    verify(projectRepository).findById("1");
    verify(projectRepository).findByName("New Name");
  }

  @Test
  public void testUpdateProjectWithNonExistingBusinessLine() {
    // Arrange
    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setId("1");
    projectDTO.setName("New Name");
    BusinessLine businessLine = new BusinessLine();
    businessLine.setId("1");
    projectDTO.setBusinessLine(businessLine);

    Project existingProject = new Project();
    existingProject.setId("1");
    existingProject.setName("Old Name");

    when(projectRepository.findById("1")).thenReturn(Optional.of(existingProject));
    when(projectRepository.findByName("New Name")).thenReturn(null);
    when(businessLineRepository.findById("1")).thenReturn(Optional.empty());

    // Act
    assertThrows(CustomRuntimeException.class,
        () -> projectService.updateProject(projectDTO),
        CustomRuntimeException.BUSINESS_LINE_NOT_FOUND);

    // Assert
    verify(projectRepository).findById("1");
    verify(projectRepository).findByName("New Name");
    verify(businessLineRepository).findById("1");
  }

  @Test
  public void testUpdateProjectWithNonExistingTeam() {
    // Arrange
    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setId("1");
    projectDTO.setName("New Name");
    Team team = new Team();
    team.setId("1");
    projectDTO.setTeam(team);

    Project existingProject = new Project();
    existingProject.setId("1");
    existingProject.setName("Old Name");

    when(projectRepository.findById("1")).thenReturn(Optional.of(existingProject));
    when(projectRepository.findByName("New Name")).thenReturn(null);
    when(teamRepository.findById("1")).thenReturn(Optional.empty());

    // Act
    assertThrows(CustomRuntimeException.class,
        () -> projectService.updateProject(projectDTO),
        CustomRuntimeException.TEAM_NOT_FOUND);

    // Assert
    verify(projectRepository).findById("1");
    verify(projectRepository).findByName("New Name");
    verify(teamRepository).findById("1");
  }
}