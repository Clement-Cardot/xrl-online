package fr.eseo.pfe.xrlonline.controller;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.AssessmentDTO;
import fr.eseo.pfe.xrlonline.model.dto.BusinessLineDTO;
import fr.eseo.pfe.xrlonline.model.dto.AssessmentDTO.TagDTO;
import fr.eseo.pfe.xrlonline.model.dto.ProjectDTO;
import fr.eseo.pfe.xrlonline.model.dto.TeamDTO;
import fr.eseo.pfe.xrlonline.service.ProjectService;

@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class ProjectControllerTest {

  private MockMvc mockMvc;

  @Mock
  private ProjectService projectService;

  @InjectMocks
  private ProjectController projectController;

  List<ProjectDTO> existingProjects;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    mockMvc = MockMvcBuilders.standaloneSetup(projectController).build();

    existingProjects = new ArrayList<>();
    ProjectDTO project1 = new ProjectDTO();
    project1.setId("1");
    project1.setName("Project 1");
    project1.setAssessments(new ArrayList<>());
    ProjectDTO project2 = new ProjectDTO();
    project2.setId("2");
    project2.setName("Project 2");
    project2.setAssessments(new ArrayList<>());
    existingProjects.add(project1);
    existingProjects.add(project2);
  }

  @AfterEach
  void tearDown() {
      reset(projectService);
  }

  @Test
  void getProjectsTest() throws Exception {
    // Arrange
    when(projectService.getAllProjects()).thenReturn(existingProjects);

    // Act
    assertDoesNotThrow(() -> 
            mockMvc.perform(MockMvcRequestBuilders.get("/projects/get-all-projects")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").value("Project 1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].name").value("Project 2"))
        );
  }

  @Test
  void createProjectTest() throws Exception {
    TeamDTO teamDTO = new TeamDTO();
    teamDTO.setId("1");
    teamDTO.setName("Team 1");

    BusinessLineDTO businessLineDTO = new BusinessLineDTO();
    businessLineDTO.setId("1");
    businessLineDTO.setName("Business Line 1");

    ProjectDTO projectDTOToCreate = new ProjectDTO();
    projectDTOToCreate.setName("Project 3");
    projectDTOToCreate.setAssessments(new ArrayList<>());
    projectDTOToCreate.setTeam(teamDTO);
    projectDTOToCreate.setBusinessLine(businessLineDTO);

    when(projectService.createProject(projectDTOToCreate)).thenReturn(projectDTOToCreate);

    assertDoesNotThrow(() -> 
            mockMvc.perform(MockMvcRequestBuilders.post("/projects/create-project")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(projectDTOToCreate)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Project 3"))
        );
  }

  @Test
  void createProjectWhenInvalidFormTest() throws Exception {
    TeamDTO teamDTO = new TeamDTO();
    teamDTO.setId("1");
    teamDTO.setName("Team 1");

    BusinessLineDTO businessLineDTO = new BusinessLineDTO();
    businessLineDTO.setId("1");
    businessLineDTO.setName("Business Line 1");

    ProjectDTO projectDTOToCreate = new ProjectDTO();
    projectDTOToCreate.setId("1");
    projectDTOToCreate.setName("Project 2");
    projectDTOToCreate.setAssessments(new ArrayList<>());
    projectDTOToCreate.setTeam(teamDTO);
    projectDTOToCreate.setBusinessLine(businessLineDTO);

    when(projectService.createProject(projectDTOToCreate)).thenThrow(new CustomRuntimeException(CustomRuntimeException.PROJECT_NAME_ALREADY_EXISTS));

    assertDoesNotThrow(() -> 
            mockMvc.perform(MockMvcRequestBuilders.post("/projects/create-project")
                            .content(asJsonString(projectDTOToCreate))
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(MockMvcResultMatchers.status().isConflict())
        );
  }

  @Test
  void deleteProjectTest() throws Exception {
    when(projectService.deleteProject("1")).thenReturn(existingProjects.get(0));

    assertDoesNotThrow(() -> 
            mockMvc.perform(MockMvcRequestBuilders.delete("/projects/delete-project")
                            .param("id", "1")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(MockMvcResultMatchers.status().isOk())
                    .andExpect(MockMvcResultMatchers.jsonPath("$.id").value("1"))
                    .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Project 1"))
        );
  }

  @Test
  void deleteProjectWhenInvalidIdTest() throws Exception {
    when(projectService.deleteProject("nonexistentId")).thenThrow(new CustomRuntimeException(CustomRuntimeException.PROJECT_NOT_FOUND));

    assertDoesNotThrow(() -> 
      mockMvc.perform(MockMvcRequestBuilders.delete("/projects/delete-project")
                      .param("id", "nonexistentId")
                      .contentType(MediaType.APPLICATION_JSON))
              .andExpect(MockMvcResultMatchers.status().isNotFound())
    );
  }

  @Test
  void updateProjectTest() throws Exception {
    TeamDTO teamDTO = new TeamDTO();
    teamDTO.setId("1");
    teamDTO.setName("Team 1");

    BusinessLineDTO businessLineDTO = new BusinessLineDTO();
    businessLineDTO.setId("1");
    businessLineDTO.setName("Business Line 1");

    ProjectDTO projectDTOUpdated = new ProjectDTO();
    projectDTOUpdated.setId("1");
    projectDTOUpdated.setName("Project 1 Bis");
    projectDTOUpdated.setAssessments(new ArrayList<>());
    projectDTOUpdated.setTeam(teamDTO);
    projectDTOUpdated.setBusinessLine(businessLineDTO);
    
    when(projectService.updateProject(projectDTOUpdated)).thenReturn(projectDTOUpdated);

    assertDoesNotThrow(() -> 
      mockMvc.perform(MockMvcRequestBuilders.put("/projects/update-project")
                    .content(asJsonString(projectDTOUpdated))
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.status().isOk())
            .andExpect(MockMvcResultMatchers.jsonPath("$.id").value("1"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Project 1 Bis"))
    );
  }

  @Test
  void updateProjectWhenInvalidFormTest() throws Exception {
    TeamDTO teamDTO = new TeamDTO();
    teamDTO.setId("1");
    teamDTO.setName("Team 1");

    BusinessLineDTO businessLineDTO = new BusinessLineDTO();
    businessLineDTO.setId("1");
    businessLineDTO.setName("Business Line 1");

    ProjectDTO projectDTOUpdated = new ProjectDTO();
    projectDTOUpdated.setId("1");
    projectDTOUpdated.setName("Project 2");
    projectDTOUpdated.setAssessments(new ArrayList<>());
    projectDTOUpdated.setTeam(teamDTO);
    projectDTOUpdated.setBusinessLine(businessLineDTO);
    
    when(projectService.updateProject(projectDTOUpdated)).thenThrow(new CustomRuntimeException(CustomRuntimeException.PROJECT_NAME_ALREADY_EXISTS));

    assertDoesNotThrow(() -> 
      mockMvc.perform(MockMvcRequestBuilders.put("/projects/update-project")
                    .content(asJsonString(projectDTOUpdated))
                    .contentType(MediaType.APPLICATION_JSON))
                  .andExpect(MockMvcResultMatchers.status().isConflict())
    );
  }

  @Test
  void addNewAssessmentTest() throws Exception {
      AssessmentDTO assessmentDTO = createAssessmentDTO();
      ProjectDTO projectDTO = createProjectDTO();
      String projectId = projectDTO.getId();
      when(projectService.isMemberOfProjectTeam(projectId)).thenReturn(true);
      when(projectService.addNewAssessment(projectId, assessmentDTO)).thenReturn(projectDTO);

      assertDoesNotThrow(() ->
              mockMvc.perform(MockMvcRequestBuilders.post("/projects/add-new-assessment")
                      .param("projectId", projectDTO.getId())
                      .contentType(MediaType.APPLICATION_JSON)
                      .content(asJsonString(assessmentDTO)))
                      .andExpect(MockMvcResultMatchers.status().isOk())
                      .andExpect(MockMvcResultMatchers.content().json(asJsonString(projectDTO)))
      );

      verify(projectService).isMemberOfProjectTeam(projectDTO.getId());
      verify(projectService).addNewAssessment(projectDTO.getId(), assessmentDTO);
      verifyNoMoreInteractions(projectService);
  }

  @Test
  void addNewAssessmentTest_NotMemberOfTeam() throws Exception {
      AssessmentDTO assessmentDTO = createAssessmentDTO();
      ProjectDTO projectDTO = createProjectDTO();
      String projectId = projectDTO.getId();
      when(projectService.isMemberOfProjectTeam(projectId)).thenReturn(false);
      when(projectService.addNewAssessment(projectId, assessmentDTO)).thenReturn(projectDTO);

      assertDoesNotThrow(() ->
              mockMvc.perform(MockMvcRequestBuilders.post("/projects/add-new-assessment")
                      .param("projectId", projectDTO.getId())
                      .contentType(MediaType.APPLICATION_JSON)
                      .content(asJsonString(assessmentDTO)))
                      .andExpect(MockMvcResultMatchers.status().isUnauthorized())
      );

      verify(projectService).isMemberOfProjectTeam(projectDTO.getId());
      verify(projectService, times(0)).addNewAssessment(projectDTO.getId(), assessmentDTO);
      verifyNoMoreInteractions(projectService);
  }

  @Test
  void addNewAssessmentWhenInvalidFormTest() throws Exception {
      AssessmentDTO assessmentDTO = createAssessmentDTO();
      ProjectDTO projectDTO = createProjectDTO();
      String projectId = projectDTO.getId();
      when(projectService.isMemberOfProjectTeam(projectId)).thenReturn(true);
      when(projectService.addNewAssessment(projectId, assessmentDTO)).thenReturn(projectDTO);
      when(projectService.addNewAssessment(projectDTO.getId(), assessmentDTO))
              .thenThrow(new CustomRuntimeException(CustomRuntimeException.PROJECT_NOT_FOUND));

      assertDoesNotThrow(() ->
              mockMvc.perform(MockMvcRequestBuilders.post("/projects/add-new-assessment")
                      .param("projectId", projectDTO.getId())
                      .contentType(MediaType.APPLICATION_JSON)
                      .content(asJsonString(assessmentDTO)))
                      .andExpect(MockMvcResultMatchers.status().isNotFound())
      );

      verify(projectService).isMemberOfProjectTeam(projectDTO.getId());
      verify(projectService).addNewAssessment(projectDTO.getId(), assessmentDTO);
      verifyNoMoreInteractions(projectService);
  }

  @Test
  void getProjectByIdTest() throws Exception {
      String projectId = "1";
      ProjectDTO projectDTO = createProjectDTO();
      when(projectService.getProjectById(projectId)).thenReturn(projectDTO);

      assertDoesNotThrow(() ->
              mockMvc.perform(MockMvcRequestBuilders.get("/projects/get-project-by-id")
                      .param("id", projectId))
                      .andExpect(MockMvcResultMatchers.status().isOk())
                      .andExpect(MockMvcResultMatchers.content().json(asJsonString(projectDTO)))
      );

      verify(projectService).getProjectById(projectId);
      verifyNoMoreInteractions(projectService);
  }

  @Test
  void getProjectByIdWhenInvalidIdTest() throws Exception {
      String invalidId = "invalidId";
      CustomRuntimeException exception = new CustomRuntimeException(CustomRuntimeException.PROJECT_NOT_FOUND);
      when(projectService.getProjectById(invalidId)).thenThrow(exception);

      assertDoesNotThrow(() ->
              mockMvc.perform(MockMvcRequestBuilders.get("/projects/get-project-by-id")
                      .param("id", invalidId))
                      .andExpect(MockMvcResultMatchers.status().isNotFound())
      );

      verify(projectService).getProjectById(invalidId);
      verifyNoMoreInteractions(projectService);
  }

  @Test
  void modifyAssessmentCommentTest() throws Exception {
      String projectId = "1";
      AssessmentDTO assessmentDTO = createAssessmentDTO();
      String[] data = {"1", "Comment 1"};
      ProjectDTO projectDTO = createProjectDTO();
      when(projectService.isMemberOfProjectTeam(projectId)).thenReturn(true);
      when(projectService.modifyAssessmentComment(projectId, data)).thenReturn(projectDTO);

      assertDoesNotThrow(() ->
              mockMvc.perform(MockMvcRequestBuilders.put("/projects/modify-assessment-comment")
                      .param("projectId", projectId)
                      .contentType(MediaType.APPLICATION_JSON)
                      .content(asJsonString(data)))
                      .andExpect(MockMvcResultMatchers.status().isOk())
                      .andExpect(MockMvcResultMatchers.content().json(asJsonString(projectDTO)))
      );

      verify(projectService).isMemberOfProjectTeam(projectId);
      verify(projectService).modifyAssessmentComment(projectId, data);
      verifyNoMoreInteractions(projectService);
  }

  @Test
  void modifyAssessmentCommentTest_NotMemberOfTeam() throws Exception {
      String projectId = "1";
      AssessmentDTO assessmentDTO = createAssessmentDTO();
      String[] data = {"1", "Comment 1"};
      ProjectDTO projectDTO = createProjectDTO();
      when(projectService.isMemberOfProjectTeam(projectId)).thenReturn(false);
      when(projectService.modifyAssessmentComment(projectId, data)).thenReturn(projectDTO);

      assertDoesNotThrow(() ->
              mockMvc.perform(MockMvcRequestBuilders.put("/projects/modify-assessment-comment")
                      .param("projectId", projectId)
                      .contentType(MediaType.APPLICATION_JSON)
                      .content(asJsonString(data)))
                      .andExpect(MockMvcResultMatchers.status().isUnauthorized())
      );

      verify(projectService).isMemberOfProjectTeam(projectId);
      verify(projectService, times(0)).modifyAssessmentComment(projectId, data);
      verifyNoMoreInteractions(projectService);
  }

  @Test
  void modifyAssessmentCommentTest_Error() throws Exception {
      String projectId = "1";
      AssessmentDTO assessmentDTO = createAssessmentDTO();
      String[] data = {"1", "Comment 1"};
      ProjectDTO projectDTO = createProjectDTO();
      when(projectService.isMemberOfProjectTeam(projectId)).thenReturn(true);
      when(projectService.modifyAssessmentComment(projectId, data)).thenThrow(new CustomRuntimeException(CustomRuntimeException.INTERNAL_SERVER_ERROR));

      assertDoesNotThrow(() ->
              mockMvc.perform(MockMvcRequestBuilders.put("/projects/modify-assessment-comment")
                      .param("projectId", projectId)
                      .contentType(MediaType.APPLICATION_JSON)
                      .content(asJsonString(data)))
                      .andExpect(MockMvcResultMatchers.status().isInternalServerError())
      );

      verify(projectService).isMemberOfProjectTeam(projectId);
      verify(projectService).modifyAssessmentComment(projectId, data);
      verifyNoMoreInteractions(projectService);
  }

  @Test
  void modifyLastAssessmentTest() throws Exception {
      String projectId = "1";
      AssessmentDTO assessmentDTO = createAssessmentDTO();
      ProjectDTO projectDTO = createProjectDTO();
      when(projectService.isMemberOfProjectTeam(projectId)).thenReturn(true);
      when(projectService.modifyAssessment(projectId, assessmentDTO)).thenReturn(projectDTO);

      assertDoesNotThrow(() ->
              mockMvc.perform(MockMvcRequestBuilders.put("/projects/modify-assessment")
                      .param("projectId", projectId)
                      .contentType(MediaType.APPLICATION_JSON)
                      .content(asJsonString(assessmentDTO)))
                      .andExpect(MockMvcResultMatchers.status().isOk())
                      .andExpect(MockMvcResultMatchers.content().json(asJsonString(projectDTO)))
      );

      verify(projectService).isMemberOfProjectTeam(projectId);
      verify(projectService).modifyAssessment(projectId, assessmentDTO);
      verifyNoMoreInteractions(projectService);
  }

  @Test
  void modifyLastAssessmentWhenNotMemberOfTeamTest() throws Exception {
      String projectId = "1";
      AssessmentDTO assessmentDTO = createAssessmentDTO();
      when(projectService.isMemberOfProjectTeam(projectId)).thenReturn(false);

      assertDoesNotThrow(() ->
              mockMvc.perform(MockMvcRequestBuilders.put("/projects/modify-assessment")
                      .param("projectId", projectId)
                      .contentType(MediaType.APPLICATION_JSON)
                      .content(asJsonString(assessmentDTO)))
                      .andExpect(MockMvcResultMatchers.status().is4xxClientError())
      );

      verify(projectService).isMemberOfProjectTeam(projectId);
      verifyNoMoreInteractions(projectService);
  }

  @Test
  void getProjectsByTeamIdTest() throws Exception {
    String teamId = "1";

    ProjectDTO project1 = new ProjectDTO();
    project1.setId("1");
    project1.setName("Project 1");
    project1.setAssessments(new ArrayList<>());

    ProjectDTO project2 = new ProjectDTO();
    project2.setId("2");
    project2.setName("Project 2");
    project2.setAssessments(new ArrayList<>());

    List<ProjectDTO> projects = new ArrayList<>();
    projects.add(project1);
    projects.add(project2);

    when(projectService.getProjectsByTeamId(teamId)).thenReturn(ResponseEntity.ok(projects));

    assertDoesNotThrow(() ->
      mockMvc.perform(MockMvcRequestBuilders.get("/projects/get-projects-by-team-id")
          .param("id", teamId)
          .contentType(MediaType.APPLICATION_JSON))
          .andExpect(MockMvcResultMatchers.status().isOk())
          .andExpect(MockMvcResultMatchers.jsonPath("$").isArray())
          .andExpect(MockMvcResultMatchers.jsonPath("$[0]").exists())
          .andExpect(MockMvcResultMatchers.jsonPath("$[1]").exists())
    );

    verify(projectService).getProjectsByTeamId(teamId);
    verifyNoMoreInteractions(projectService);
  }

  @Test
  void getProjectsByTeamIdTest_ThrowsCustomRuntimeException() throws Exception {
    String teamId = "1";
    CustomRuntimeException exception = new CustomRuntimeException(CustomRuntimeException.INTERNAL_SERVER_ERROR);

    when(projectService.getProjectsByTeamId(teamId)).thenThrow(exception);

    assertDoesNotThrow(() ->
      mockMvc.perform(MockMvcRequestBuilders.get("/projects/get-projects-by-team-id")
          .param("id", teamId)
          .contentType(MediaType.APPLICATION_JSON))
          .andExpect(MockMvcResultMatchers.status().isInternalServerError())
    );

    verify(projectService).getProjectsByTeamId(teamId);
    verifyNoMoreInteractions(projectService);
  }

  @Test
  void getProjectsByBLIdTest() throws Exception {
    String businessLineId = "1";

    ProjectDTO project1 = new ProjectDTO();
    project1.setId("1");
    project1.setName("Project 1");
    project1.setAssessments(new ArrayList<>());

    ProjectDTO project2 = new ProjectDTO();
    project2.setId("2");
    project2.setName("Project 2");
    project2.setAssessments(new ArrayList<>());

    List<ProjectDTO> projects = new ArrayList<>();
    projects.add(project1);
    projects.add(project2);

    when(projectService.getProjectsByBusinessLineId(businessLineId)).thenReturn(ResponseEntity.ok(projects));

    assertDoesNotThrow(() ->
      mockMvc.perform(MockMvcRequestBuilders.get("/projects/get-projects-by-business-line-id")
          .param("id", businessLineId)
          .contentType(MediaType.APPLICATION_JSON))
          .andExpect(MockMvcResultMatchers.status().isOk())
          .andExpect(MockMvcResultMatchers.jsonPath("$").isArray())
          .andExpect(MockMvcResultMatchers.jsonPath("$[0]").exists())
          .andExpect(MockMvcResultMatchers.jsonPath("$[1]").exists())
    );

    verify(projectService).getProjectsByBusinessLineId(businessLineId);
    verifyNoMoreInteractions(projectService);
  }

  @Test
  void getProjectsByBLIdTest_ThrowsCustomRuntimeException() throws Exception {
    String businessLineId = "1";
    CustomRuntimeException exception = new CustomRuntimeException(CustomRuntimeException.INTERNAL_SERVER_ERROR);

    when(projectService.getProjectsByBusinessLineId(businessLineId)).thenThrow(exception);

    assertDoesNotThrow(() ->
      mockMvc.perform(MockMvcRequestBuilders.get("/projects/get-projects-by-business-line-id")
          .param("id", businessLineId)
          .contentType(MediaType.APPLICATION_JSON))
          .andExpect(MockMvcResultMatchers.status().isInternalServerError())
    );

    verify(projectService).getProjectsByBusinessLineId(businessLineId);
    verifyNoMoreInteractions(projectService);
  }

  @Test
  void deleteAssessmentTest() throws Exception {
    AssessmentDTO assessmentDTO = createAssessmentDTO();
    ProjectDTO projectDTO = createProjectDTO();
    String projectId = projectDTO.getId();
    
    when(projectService.isAdmin()).thenReturn(true);
    when(projectService.deleteAssessment(projectId, assessmentDTO)).thenReturn(projectDTO);

    assertDoesNotThrow(() ->
      mockMvc.perform(MockMvcRequestBuilders.post("/projects/delete-assessment")
        .param("projectId", projectId)
        .contentType(MediaType.APPLICATION_JSON)
        .content(asJsonString(assessmentDTO)))
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(projectDTO.getId()))
        .andExpect(MockMvcResultMatchers.jsonPath("$.name").value(projectDTO.getName()))
    );

    verify(projectService).isAdmin();
    verify(projectService).deleteAssessment(projectId, assessmentDTO);
    verifyNoMoreInteractions(projectService);
  }

  @Test
  void deleteAssessmentTest_UserNotAdmin() throws Exception {
    AssessmentDTO assessmentDTO = createAssessmentDTO();
    ProjectDTO projectDTO = createProjectDTO();
    String projectId = projectDTO.getId();
    
    when(projectService.isAdmin()).thenReturn(false);

    assertDoesNotThrow(() ->
      mockMvc.perform(MockMvcRequestBuilders.post("/projects/delete-assessment")
        .param("projectId", projectId)
        .contentType(MediaType.APPLICATION_JSON)
        .content(asJsonString(assessmentDTO)))
        .andExpect(MockMvcResultMatchers.status().isUnauthorized())
    );

    verify(projectService).isAdmin();
    verify(projectService, times(0)).deleteAssessment(projectId, assessmentDTO);
    verifyNoMoreInteractions(projectService);
  }

  @Test
  void deleteAssessmentTest_InvalidForm() throws Exception {
    AssessmentDTO assessmentDTO = createAssessmentDTO();
    ProjectDTO projectDTO = createProjectDTO();
    String projectId = projectDTO.getId();
    
    when(projectService.isAdmin()).thenReturn(true);
    when(projectService.deleteAssessment(projectId, assessmentDTO)).thenThrow(new CustomRuntimeException(CustomRuntimeException.PROJECT_NOT_FOUND));

    assertDoesNotThrow(() ->
      mockMvc.perform(MockMvcRequestBuilders.post("/projects/delete-assessment")
        .param("projectId", projectId)
        .contentType(MediaType.APPLICATION_JSON)
        .content(asJsonString(assessmentDTO)))
        .andExpect(MockMvcResultMatchers.status().isNotFound())
    );

    verify(projectService).isAdmin();
    verify(projectService).deleteAssessment(projectId, assessmentDTO);
    verifyNoMoreInteractions(projectService);
  }

  // Helper methods for creating DTOs and setting up mocks

  private ProjectDTO createProjectDTO() {
      ProjectDTO projectDTO = new ProjectDTO();
      projectDTO.setId("1");
      projectDTO.setName("Project 1");
      projectDTO.setAssessments(new ArrayList<>());
      return projectDTO;
  }

  private AssessmentDTO createAssessmentDTO() {
      AssessmentDTO assessmentDTO = new AssessmentDTO();
      assessmentDTO.setDate(new Date());
      assessmentDTO.setComment("Comment 1");
      assessmentDTO.setTag(TagDTO.INITIAL);
      return assessmentDTO;
  }

  // Méthode utilitaire pour convertir un objet en JSON
  private static String asJsonString(final Object obj) {
    try {
        return new ObjectMapper().writeValueAsString(obj);
    } catch (Exception e) {
        throw new RuntimeException(e);
    }
}
}