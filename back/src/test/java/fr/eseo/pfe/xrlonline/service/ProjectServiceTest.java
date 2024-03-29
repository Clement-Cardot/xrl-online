package fr.eseo.pfe.xrlonline.service;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.logger.UserLogger;
import fr.eseo.pfe.xrlonline.model.dto.AssessmentDTO;
import fr.eseo.pfe.xrlonline.model.dto.BusinessLineDTO;
import fr.eseo.pfe.xrlonline.model.dto.ProjectDTO;
import fr.eseo.pfe.xrlonline.model.dto.TeamDTO;
import fr.eseo.pfe.xrlonline.model.dto.AssessmentDTO.TagDTO;
import fr.eseo.pfe.xrlonline.model.entity.Assessment;
import fr.eseo.pfe.xrlonline.model.entity.BusinessLine;
import fr.eseo.pfe.xrlonline.model.entity.Project;
import fr.eseo.pfe.xrlonline.model.entity.Team;
import fr.eseo.pfe.xrlonline.model.entity.User;
import fr.eseo.pfe.xrlonline.model.entity.Assessment.Tag;
import fr.eseo.pfe.xrlonline.repository.BusinessLineRepository;
import fr.eseo.pfe.xrlonline.repository.ProjectRepository;
import fr.eseo.pfe.xrlonline.repository.TeamRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

  @InjectMocks
  private ProjectService projectService;

  @Mock
  private ProjectRepository projectRepository;

  @Mock
  private BusinessLineRepository businessLineRepository;

  @Mock
  private TeamRepository teamRepository;

  @Spy
  private ModelMapper modelMapper;


  @Test
  void testGetProjects() {
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
    List<ProjectDTO> result = projectService.getAllProjects();

    // Assert
    assertEquals(2, result.size());
    assertEquals("1", result.get(0).getId());
    assertEquals("Project 1", result.get(0).getName());
    assertEquals("2", result.get(1).getId());
    assertEquals("Project 2", result.get(1).getName());

    verify(projectRepository).findAll();
  }

  @Test
  void testGetProjectById() {
    // Arrange
    String projectId = "1";
    Project project = new Project();
    project.setId(projectId);
    project.setName("Test Project");

    when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));

    // Act
    ProjectDTO result = null;
    try {
      result = projectService.getProjectById(projectId);
    } catch (CustomRuntimeException e) {
      fail("Should not throw exception", e);
    }

    // Assert
    assertNotNull(result);
    assertEquals(project.getId(), result.getId());
    assertEquals(project.getName(), result.getName());

    verify(projectRepository).findById(projectId);
  }

  @Test
  void testGetProjectByIdWithNonExistingId() {
    // Arrange
    String projectId = "nonexistentId";

    when(projectRepository.findById(projectId)).thenReturn(Optional.empty());

    // Act and Assert
    assertThrows(CustomRuntimeException.class,
        () -> projectService.getProjectById(projectId),
        CustomRuntimeException.PROJECT_NOT_FOUND);
  }

  // Returns an empty list when projectRepository has no projects
  @Test
  void testGetProjectsWithEmptyList() {
    // Arrange
    when(projectRepository.findAll()).thenReturn(new ArrayList<>());

    // Act
    List<ProjectDTO> result = projectService.getAllProjects();

    // Assert
    assertTrue(result.isEmpty());

    verify(projectRepository).findAll();
  }

  @Test
  void testCreateValidProject() {
    // Arrange
    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setName("Test Project");
    BusinessLineDTO businessLine = new BusinessLineDTO();
    businessLine.setId("1");
    projectDTO.setBusinessLine(businessLine);
    TeamDTO team = new TeamDTO();
    team.setId("1");
    projectDTO.setTeam(team);

    BusinessLine businessLineToCreate = modelMapper.map(businessLine, BusinessLine.class);
    Team teamToCreate = modelMapper.map(team, Team.class);

    when(projectRepository.findByName("Test Project")).thenReturn(null);
    when(businessLineRepository.findById("1")).thenReturn(Optional.of(businessLineToCreate));
    when(teamRepository.findById("1")).thenReturn(Optional.of(teamToCreate));
    when(projectRepository.save(any(Project.class))).thenAnswer(i -> i.getArguments()[0]);

    // Act
    ProjectDTO result = null;
    try {
      result = projectService.createProject(projectDTO);
    } catch (CustomRuntimeException e) {
      fail("Should not throw exception", e);
    }

    // Assert
    assertNotNull(result);
    assertEquals(result.getName(), projectDTO.getName());
    assertEquals(result.getBusinessLine(), projectDTO.getBusinessLine());
    assertEquals(result.getTeam(), projectDTO.getTeam());
    assertEquals("", result.getDescription());
    assertEquals(result.getAssessments(), List.of());
  }

  @Test
  void testCreateProjectWithProjectNameNull() {
    // Arrange
    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setBusinessLine(new BusinessLineDTO());
    projectDTO.getBusinessLine().setId("1");
    projectDTO.setTeam(new TeamDTO());
    projectDTO.getTeam().setId("1");

    // Act & Assert
    assertThrows(CustomRuntimeException.class,
        () -> projectService.createProject(projectDTO),
        CustomRuntimeException.PROJECT_NAME_NULL);
  }

  @Test
  void testCreateProjectWithBusinessLineNull() {
    // Arrange
    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setName("Test Project");
    projectDTO.setTeam(new TeamDTO());

    // Act & Assert
    assertThrows(CustomRuntimeException.class,
        () -> projectService.createProject(projectDTO),
        CustomRuntimeException.PROJECT_BUSINESS_LINE_NULL);
  }

  @Test
  void testCreateProjectWithTeamNull() {
    // Arrange
    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setName("Test Project");
    projectDTO.setBusinessLine(new BusinessLineDTO());

    // Act & Assert
    assertThrows(CustomRuntimeException.class,
        () -> projectService.createProject(projectDTO),
        CustomRuntimeException.PROJECT_TEAM_NULL);
  }

  @Test
  void testCreateProjectWithProjectNameAlreadyExist() {
    // Arrange
    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setName("Test Project");
    BusinessLineDTO businessLine = new BusinessLineDTO();
    businessLine.setId("1");
    projectDTO.setBusinessLine(businessLine);
    TeamDTO team = new TeamDTO();
    team.setId("1");
    projectDTO.setTeam(team);

    Project projectToCreate = modelMapper.map(projectDTO, Project.class);

    when(projectRepository.findByName("Test Project")).thenReturn(projectToCreate);

    // Act and Assert
    assertThrows(CustomRuntimeException.class,
        () -> projectService.createProject(projectDTO),
        CustomRuntimeException.PROJECT_NAME_ALREADY_EXISTS);
  }

  @Test
  void testCreateProjectWithBusinessLineNotFound() {
    // Arrange
    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setName("Test Project");
    BusinessLineDTO businessLine = new BusinessLineDTO();
    businessLine.setId("1");
    projectDTO.setBusinessLine(businessLine);
    TeamDTO team = new TeamDTO();
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
  void testCreateProjectWithTeamNotFound() {
    // Arrange
    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setName("Test Project");
    BusinessLineDTO businessLine = new BusinessLineDTO();
    businessLine.setId("1");
    projectDTO.setBusinessLine(businessLine);
    TeamDTO team = new TeamDTO();
    team.setId("1");
    projectDTO.setTeam(team);

    BusinessLine businessLineToCreate = modelMapper.map(businessLine, BusinessLine.class);

    when(projectRepository.findByName("Test Project")).thenReturn(null);
    when(businessLineRepository.findById("1")).thenReturn(Optional.of(businessLineToCreate));
    when(teamRepository.findById("1")).thenReturn(Optional.empty());

    // Act and Assert
    assertThrows(CustomRuntimeException.class,
        () -> projectService.createProject(projectDTO),
        CustomRuntimeException.TEAM_NOT_FOUND);
  }

  @Test
  void testDeleteValidProject() {
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
  void testDeleteNonExistingProject() {
    // Arrange
    String projectId = "nonexistentId";

    when(projectRepository.findById(projectId)).thenReturn(Optional.empty());

    // Act and Assert
    assertThrows(CustomRuntimeException.class,
        () -> projectService.deleteProject(projectId),
        CustomRuntimeException.PROJECT_NOT_FOUND);
  }

  @Test
  void testDeleteProjectWithNullId() {
    // Arrange
    String projectId = null;

    // Act and Assert
    assertThrows(CustomRuntimeException.class,
        () -> projectService.deleteProject(projectId),
        CustomRuntimeException.PROJECT_NOT_FOUND);
  }

  @Test
  void testUpdateAllFieldOfProject() {
    // Arrange
    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setId("1");
    projectDTO.setName("New Name");
    projectDTO.setDescription("New Description");
    BusinessLineDTO businessLine = new BusinessLineDTO();
    businessLine.setId("1");
    businessLine.setName("New Business Line");
    projectDTO.setBusinessLine(businessLine);
    TeamDTO team = new TeamDTO();
    team.setId("1");
    team.setName("New Team");
    projectDTO.setTeam(team);
    List<AssessmentDTO> assessments = new ArrayList<>();
    AssessmentDTO assessment = new AssessmentDTO();
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
    when(businessLineRepository.findById("1")).thenReturn(Optional.of(oldBusinessLine));
    when(teamRepository.findById("1")).thenReturn(Optional.of(oldTeam));
    when(projectRepository.save(saveProject)).thenReturn(saveProject);

    // Act
    ProjectDTO updatedProject = null;
    try {
      updatedProject = projectService.updateProject(projectDTO);
    } catch (CustomRuntimeException e) {
      fail("Should not throw exception", e);
    }

    // Assert
    assertNotNull(updatedProject);
    assertEquals("New Name", updatedProject.getName());
    assertEquals("New Description", updatedProject.getDescription());
    assertEquals("New Business Line", updatedProject.getBusinessLine().getName());
    assertEquals("New Team", updatedProject.getTeam().getName());
    assertEquals(1, updatedProject.getAssessments().size());
    assertEquals("New comment", updatedProject.getAssessments().get(0).getComment());
  }

  @Test
  void testUpdateProjectWithNullId() {
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
  void testUpdateNonExistingProject() {
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
  void testUpdateProjectWithAlreadyExistingName() {
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
  void testUpdateProjectWithNonExistingBusinessLine() {
    // Arrange
    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setId("1");
    projectDTO.setName("New Name");
    BusinessLineDTO businessLine = new BusinessLineDTO();
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
  void testUpdateProjectWithNonExistingTeam() {
    // Arrange
    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setId("1");
    projectDTO.setName("New Name");
    TeamDTO team = new TeamDTO();
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

  @Test
  void testAddNewAssessment() {
    // Arrange
    String projectId = "1";
    AssessmentDTO assessmentDTO = new AssessmentDTO();
    assessmentDTO.setComment("New comment");

    Project existingProject = new Project();
    existingProject.setId(projectId);
    existingProject.setAssessments(new ArrayList<>());

    when(projectRepository.findById(projectId)).thenReturn(Optional.of(existingProject));
    when(projectRepository.save(existingProject)).thenReturn(existingProject);

    // Act
    ProjectDTO result = null;
    try {
      result = projectService.addNewAssessment(projectId, assessmentDTO);
    } catch (CustomRuntimeException e) {
      fail("Should not throw exception", e);
    }

    // Assert
    assertNotNull(result);
    assertEquals(projectId, result.getId());
    assertEquals(1, result.getAssessments().size());
    assertEquals(assessmentDTO.getComment(), result.getAssessments().get(0).getComment());

    verify(projectRepository).findById(projectId);
    verify(projectRepository).save(existingProject);
  }

  @Test
  void testAddNewAssessmentWithNonExistingProject() {
    // Arrange
    String projectId = "nonexistentId";
    AssessmentDTO assessmentDTO = new AssessmentDTO();
    assessmentDTO.setComment("New comment");

    when(projectRepository.findById(projectId)).thenReturn(Optional.empty());

    // Act and Assert
    assertThrows(CustomRuntimeException.class,
        () -> projectService.addNewAssessment(projectId, assessmentDTO),
        CustomRuntimeException.PROJECT_NOT_FOUND);

    verify(projectRepository).findById(projectId);
  }

  @Test
  void testModifyAssessmentComment() {
    // Arrange
    String projectId = "1";
    String comment = "New comment";
    String[] data = {"0", comment};
    System.out.println(data[0]);
    List<Assessment> assessments = new ArrayList<>();
    Assessment assessment = new Assessment();
    assessment.setComment("First Comment");
    assessments.add(assessment);

    Project existingProject = new Project();
    existingProject.setId(projectId);
    existingProject.setAssessments(assessments);

    when(projectRepository.findById(projectId)).thenReturn(Optional.of(existingProject));
    when(projectRepository.save(existingProject)).thenReturn(existingProject);

    // Act
    ProjectDTO result = null;
    try {
      result = projectService.modifyAssessmentComment(projectId, data);
    } catch (CustomRuntimeException e) {
      fail("Should not throw exception", e);
    }

    // Assert
    assertNotNull(result);
    assertEquals(projectId, result.getId());
    assertEquals(1, result.getAssessments().size());
    assertEquals(comment, result.getAssessments().get(0).getComment());

    verify(projectRepository).findById(projectId);
    verify(projectRepository).save(existingProject);
  }

  @Test
  void testModifyAssessmentCommentNull() {
    // Arrange
    String projectId = "1";
    String newComment = null;
    String firstComment = "First Comment";
    String[] data = {"1", newComment};
    List<Assessment> assessments = new ArrayList<>();
    Assessment assessment = new Assessment();
    assessment.setComment(firstComment);
    assessments.add(assessment);

    Project existingProject = new Project();
    existingProject.setId(projectId);
    existingProject.setAssessments(assessments);

    when(projectRepository.findById(projectId)).thenReturn(Optional.of(existingProject));

    // Act
    // Assert
    CustomRuntimeException customRuntimeException = assertThrowsExactly(CustomRuntimeException.class,
            () -> projectService.modifyAssessmentComment(projectId, data),
            CustomRuntimeException.PROJECT_LAST_ASSESSMENT_COMMENT_NULL);
    assertEquals(CustomRuntimeException.PROJECT_LAST_ASSESSMENT_COMMENT_NULL, customRuntimeException.getMessage());

    verify(projectRepository).findById(projectId);
  }

  @Test
  void testModifyAssessmentCommentAssessmentListEmpty() {
    // Arrange
    String projectId = "1";
    String newComment = "New Comment";
    String[] data = {"1", newComment};
    List<Assessment> assessments = new ArrayList<>();

    Project existingProject = new Project();
    existingProject.setId(projectId);
    existingProject.setAssessments(assessments);

    when(projectRepository.findById(projectId)).thenReturn(Optional.of(existingProject));

    // Act
    // Assert
    CustomRuntimeException customRuntimeException = assertThrowsExactly(CustomRuntimeException.class,
            () -> projectService.modifyAssessmentComment(projectId, data),
            CustomRuntimeException.PROJECT_ASSESSMENT_LIST_IS_EMPTY);
    assertEquals(CustomRuntimeException.PROJECT_ASSESSMENT_LIST_IS_EMPTY, customRuntimeException.getMessage());

    verify(projectRepository).findById(projectId);
  }

  @Test
  void testModifyAssessment() {
    // Arrange
    String projectId = "1";
    AssessmentDTO assessmentDTO = new AssessmentDTO();
    assessmentDTO.setTag(TagDTO.INITIAL);
    assessmentDTO.setDraft(true);
    assessmentDTO.setComment("Modified comment");
    assessmentDTO.setDate(new Date(2002, 1, 1));
    assessmentDTO.setReadinessLevelRanks(new ArrayList<>());

    Project existingProject = new Project();
    existingProject.setId(projectId);
    Assessment lastAssessment = new Assessment();
    lastAssessment.setTag(Tag.INITIAL);
    lastAssessment.setDraft(true);
    lastAssessment.setComment("Old comment");
    lastAssessment.setDate(new Date(2002, 1, 1));
    existingProject.setAssessments(new ArrayList<>());
    existingProject.getAssessments().add(lastAssessment);

    when(projectRepository.findById(projectId)).thenReturn(Optional.of(existingProject));

    // Act
    ProjectDTO modifiedProject = null;
    try {
      modifiedProject = projectService.modifyAssessment(projectId, assessmentDTO);
    } catch (CustomRuntimeException e) {
      fail("Should not throw exception", e);
    }

    // Assert
    verify(projectRepository).findById(projectId);
    assertEquals(assessmentDTO.getComment(), existingProject.getLastAssessment().getComment());
    assertNotNull(modifiedProject);
    assertEquals(existingProject.getId(), modifiedProject.getId());
    assertEquals(1, modifiedProject.getAssessments().size());
    assertEquals(assessmentDTO.getComment(), modifiedProject.getAssessments().get(0).getComment());
  }

  @Test
  void testModifyAssessmentWithNonexistentProject() {
    // Arrange
    String projectId = "nonexistentId";
    AssessmentDTO assessmentDTO = new AssessmentDTO();
    assessmentDTO.setTag(TagDTO.INITIAL);
    assessmentDTO.setDraft(true);
    assessmentDTO.setComment("Modified comment");

    when(projectRepository.findById(projectId)).thenReturn(Optional.empty());

    // Act and Assert
    assertThrows(CustomRuntimeException.class,
        () -> projectService.modifyAssessment(projectId, assessmentDTO),
        CustomRuntimeException.PROJECT_NOT_FOUND);
  }

  @Test
  void testModifyAssessmentWithNonDraftAssessment() {
    // Arrange
    String projectId = "1";
    AssessmentDTO assessmentDTO = new AssessmentDTO();
    assessmentDTO.setTag(TagDTO.INITIAL);
    assessmentDTO.setDraft(true);
    assessmentDTO.setComment("Modified comment");
    assessmentDTO.setDate(new Date(2002, 1, 1));
    assessmentDTO.setReadinessLevelRanks(new ArrayList<>());

    Project existingProject = new Project();
    existingProject.setId(projectId);
    Assessment lastAssessment = new Assessment();
    lastAssessment.setTag(Tag.INITIAL);
    lastAssessment.setDraft(false);
    lastAssessment.setComment("Old comment");
    lastAssessment.setDate(new Date(2002, 1, 1));
    existingProject.setAssessments(new ArrayList<>());
    existingProject.getAssessments().add(lastAssessment);

    when(projectRepository.findById(projectId)).thenReturn(Optional.of(existingProject));

    // Act and Assert
    assertThrows(CustomRuntimeException.class,
        () -> projectService.modifyAssessment(projectId, assessmentDTO),
        CustomRuntimeException.ASSESSMENT_MUST_BE_DRAFT_TO_BE_MODIFIED);
  }

  @Test
  void testGetProjectsByTeamId() {
    // Arrange
    String teamId = "1";
    Team team = new Team();
    team.setId(teamId);

    List<Project> projects = new ArrayList<>();
    Project project1 = new Project();
    project1.setId("1");
    project1.setName("Project 1");
    project1.setTeam(team);
    Project project2 = new Project();
    project2.setId("2");
    project2.setName("Project 2");
    project2.setTeam(team);
    projects.add(project1);
    projects.add(project2);

    when(teamRepository.findById(teamId)).thenReturn(Optional.of(team));
    when(projectRepository.findByTeam(team)).thenReturn(projects);

    // Act
    ResponseEntity<List<ProjectDTO>> response = null;
    try {
      response = projectService.getProjectsByTeamId(teamId);
    } catch (CustomRuntimeException e) {
      fail("Should not throw exception", e);
    }

    // Assert
    assertNotNull(response);
    assertEquals(HttpStatus.OK, response.getStatusCode());
    List<ProjectDTO> result = response.getBody();
    assertNotNull(result);
    assertEquals(2, result.size());
    assertEquals("1", result.get(0).getId());
    assertEquals("Project 1", result.get(0).getName());
    assertEquals("2", result.get(1).getId());
    assertEquals("Project 2", result.get(1).getName());

    verify(teamRepository).findById(teamId);
    verify(projectRepository).findByTeam(team);
  }

  @Test
  void testGetProjectsByTeamIdWithNonExistingTeamId() {
    // Arrange
    String teamId = "nonexistentId";

    when(teamRepository.findById(teamId)).thenReturn(Optional.empty());

    // Act and Assert
    assertThrows(CustomRuntimeException.class,
        () -> projectService.getProjectsByTeamId(teamId),
        CustomRuntimeException.TEAM_NOT_FOUND);
  }

  @Test
  void testGetProjectsByBusinessLineId() {
    // Arrange
    String businessLineId = "1";
    BusinessLine businessLine = new BusinessLine();
    businessLine.setId(businessLineId);
    List<Project> projects = new ArrayList<>();
    Project project1 = new Project();
    project1.setId("1");
    project1.setName("Project 1");
    project1.setBusinessLine(businessLine);
    Project project2 = new Project();
    project2.setId("2");
    project2.setName("Project 2");
    project2.setBusinessLine(businessLine);
    projects.add(project1);
    projects.add(project2);

    when(businessLineRepository.findById(businessLineId)).thenReturn(Optional.of(businessLine));
    when(projectRepository.findByBusinessLine(businessLine)).thenReturn(projects);

    // Act
    ResponseEntity<List<ProjectDTO>> response = null;
    try {
      response = projectService.getProjectsByBusinessLineId(businessLineId);
    } catch (CustomRuntimeException e) {
      fail("Should not throw exception", e);
    }

    // Assert
    assertNotNull(response);
    assertEquals(HttpStatus.OK, response.getStatusCode());
    List<ProjectDTO> result = response.getBody();
    assertNotNull(result);
    assertEquals(2, result.size());
    assertEquals("1", result.get(0).getId());
    assertEquals("Project 1", result.get(0).getName());
    assertEquals("2", result.get(1).getId());
    assertEquals("Project 2", result.get(1).getName());

    verify(businessLineRepository).findById(businessLineId);
    verify(projectRepository).findByBusinessLine(businessLine);
  }

  @Test
  void testGetProjectsByBusinessLineIdWithNonExistingId() {
    // Arrange
    String businessLineId = "nonexistentId";

    when(businessLineRepository.findById(businessLineId)).thenReturn(Optional.empty());

    // Act and Assert
    assertThrows(CustomRuntimeException.class,
        () -> projectService.getProjectsByBusinessLineId(businessLineId),
        CustomRuntimeException.BUSINESS_LINE_NOT_FOUND);
  }

  @Test
  void testDeleteAssessment() {
    // Arrange
    String projectId = "1";
    AssessmentDTO assessmentDTO = new AssessmentDTO();
    assessmentDTO.setTag(TagDTO.INTERMEDIATE);
    assessmentDTO.setComment("comment");

    Project existingProject = new Project();
    existingProject.setId(projectId);
    Assessment assessmentToRemove = new Assessment();
    assessmentToRemove.setTag(Tag.INTERMEDIATE);
    assessmentToRemove.setComment("comment");
    existingProject.setAssessments(new ArrayList<>(List.of(assessmentToRemove)));

    when(projectRepository.findById(projectId)).thenReturn(Optional.of(existingProject));
    when(projectRepository.save(any(Project.class))).thenAnswer(i -> i.getArguments()[0]);

    // Act
    ProjectDTO result = null;
    try {
      result = projectService.deleteAssessment(projectId, assessmentDTO);
    } catch (CustomRuntimeException e) {
      fail("Should not throw exception", e);
    }

    // Assert
    assertNotNull(result);
    assertEquals(projectId, result.getId());
    assertTrue(result.getAssessments().isEmpty());

    verify(projectRepository).findById(projectId);
    verify(projectRepository).save(existingProject);
  }

  @Test
  void testIsMemberOfProjectTeam() {
    // Arrange
    String projectId = "1";
    Project project = new Project();
    project.setId(projectId);
    Team team = new Team();
    User user1 = new User();
    user1.setLogin("user1");
    User user2 = new User();
    user2.setLogin("user2");
    team.setMembers(List.of(user1, user2));
    project.setTeam(team);

    when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
    
    // Mock logger
    UserLogger logger = mock(UserLogger.class);
    projectService.logger = logger;
    when(logger.getUsername()).thenReturn("user1");

    // Act
    boolean result = false;
    try {
      result = projectService.isMemberOfProjectTeam(projectId);
    } catch (CustomRuntimeException e) {
      fail("Should not throw exception", e);
    }

    // Assert
    assertTrue(result);

    verify(projectRepository).findById(projectId);
    verify(logger, times(team.getMembers().size())).getUsername();
  }

  @Test
  void testIsMemberOfProjectTeamWithNonExistingProject() {
    // Arrange
    String projectId = "nonexistentId";

    when(projectRepository.findById(projectId)).thenReturn(Optional.empty());

    // Act and Assert
    assertThrows(CustomRuntimeException.class,
        () -> projectService.isMemberOfProjectTeam(projectId),
        CustomRuntimeException.PROJECT_NOT_FOUND);
  }

  @Test
  void testIsMemberOfProjectTeamWithNonMemberUser() {
    // Arrange
    String projectId = "1";
    Project project = new Project();
    project.setId(projectId);
    Team team = new Team();
    User user1 = new User();
    user1.setLogin("user1");
    User user2 = new User();
    user2.setLogin("user2");
    team.setMembers(List.of(user1, user2));
    project.setTeam(team);

    when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
    // Mock logger
    UserLogger logger = mock(UserLogger.class);
    projectService.logger = logger;
    when(logger.getUsername()).thenReturn("user3");

    // Act
    boolean result = false;
    try {
      result = projectService.isMemberOfProjectTeam(projectId);
    } catch (CustomRuntimeException e) {
      fail("Should not throw exception", e);
    }

    // Assert
    assertFalse(result);

    verify(projectRepository).findById(projectId);
    verify(logger, times(team.getMembers().size())).getUsername();
  }

  @Test
  void testIsAdmin() {
    // Mock logger
    UserLogger logger = mock(UserLogger.class);
    projectService.logger = logger;
    when(logger.getUsername()).thenReturn("admin");

    // Act
    boolean result = projectService.isAdmin();

    // Assert
    assertTrue(result);
  }

  @Test
  void testIsNotAdmin() {
    // Mock logger
    UserLogger logger = mock(UserLogger.class);
    projectService.logger = logger;
    when(logger.getUsername()).thenReturn("not admin");

    // Act
    boolean result = projectService.isAdmin();

    // Assert
    assertFalse(result);
  }
}