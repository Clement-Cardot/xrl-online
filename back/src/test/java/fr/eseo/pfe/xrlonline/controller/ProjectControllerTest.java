package fr.eseo.pfe.xrlonline.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.AssessmentDTO;
import fr.eseo.pfe.xrlonline.model.dto.AssessmentDTO.TagDTO;
import fr.eseo.pfe.xrlonline.model.dto.ProjectDTO;
import fr.eseo.pfe.xrlonline.model.dto.TeamDTO;
import fr.eseo.pfe.xrlonline.model.dto.UserDTO;
import fr.eseo.pfe.xrlonline.model.entity.Project;
import fr.eseo.pfe.xrlonline.service.ProjectService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class ProjectControllerTest {

  @Autowired
  MockMvc mockMvc;

  @Autowired
  ModelMapper modelMapper;

  @MockBean
  ProjectService projectService;

  ObjectMapper objectMapper = new ObjectMapper();

  List<ProjectDTO> existingProjects;

  @BeforeEach
  void setUp() {
    existingProjects = new ArrayList<>();
    Project project1 = new Project();
    project1.setId("1");
    project1.setName("Project 1");
    Project project2 = new Project();
    project2.setId("2");
    project2.setName("Project 2");
    existingProjects.add(modelMapper.map(project1, ProjectDTO.class));
    existingProjects.add(modelMapper.map(project2, ProjectDTO.class));
  }

  @Test
  @WithMockUser(username = "user")
  void getProjectsTest() throws Exception {
    // Arrange
    when(projectService.getAllProjects()).thenReturn(existingProjects);

    // Act
    MvcResult result = mockMvc.perform(get("/projects/get-all-projects"))
        .andExpect(status().isOk())
        .andReturn();

    // Assert
    String actualResponseBody = result.getResponse().getContentAsString();
    List<ProjectDTO> actualProjects = objectMapper.readValue(actualResponseBody,
        objectMapper.getTypeFactory().constructCollectionType(List.class, ProjectDTO.class));
    assertEquals(existingProjects, actualProjects);

    verify(projectService).getAllProjects();
    verifyNoMoreInteractions(projectService);
  }

  @Test
  @WithMockUser(username = "user")
  void createProjectTest() throws Exception {
    Project projectToCreate = new Project();
    projectToCreate.setName("Project 3");
    ProjectDTO projectDTOToCreate = modelMapper.map(projectToCreate, ProjectDTO.class);

    when(projectService.createProject(projectDTOToCreate)).thenReturn(projectDTOToCreate);

    MvcResult result = mockMvc.perform(post("/projects/create-project")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(projectDTOToCreate)))
        .andExpect(status().isOk())
        .andReturn();

    String actualResponseBody = result.getResponse().getContentAsString();
    ProjectDTO actualProject = objectMapper.readValue(actualResponseBody, ProjectDTO.class);
    assertEquals(projectDTOToCreate, actualProject);

    verify(projectService).createProject(projectDTOToCreate);
    verifyNoMoreInteractions(projectService);
  }

  @Test
  @WithMockUser(username = "user")
  void createProjectWhenInvalidFormTest() throws Exception {
    Project projectToCreate = new Project();
    projectToCreate.setName("Project 2");
    ProjectDTO projectDTOToCreate = modelMapper.map(projectToCreate, ProjectDTO.class);

    when(projectService.createProject(projectDTOToCreate)).thenThrow(new CustomRuntimeException(CustomRuntimeException.PROJECT_NAME_ALREADY_EXISTS));

    mockMvc.perform(post("/projects/create-project")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(projectDTOToCreate)))
        .andExpect(status().is4xxClientError())
        .andReturn();

    verify(projectService).createProject(projectDTOToCreate);
    verifyNoMoreInteractions(projectService);
  }

  @Test
  @WithMockUser(username = "user")
  void deleteProjectTest() throws Exception {
    // Arrange
    String id = existingProjects.get(0).getId();
    ProjectDTO projectDTOToDelete = existingProjects.get(0);

    when(projectService.deleteProject(id)).thenReturn(projectDTOToDelete);

    // Act
    MvcResult result = mockMvc.perform(delete("/projects/delete-project?id=" + id))
        .andExpect(status().isOk())
        .andReturn();

    // Assert
    String actualResponseBody = result.getResponse().getContentAsString();
    ProjectDTO actualProject = objectMapper.readValue(actualResponseBody, ProjectDTO.class);
    assertEquals(projectDTOToDelete, actualProject);

    verify(projectService).deleteProject(id);
    verifyNoMoreInteractions(projectService);
  }

  @Test
  @WithMockUser(username = "user")
  void deleteProjectWhenInvalidIdTest() throws Exception {
    // Arrange
    String id = "invalidId";

    when(projectService.deleteProject(id)).thenThrow(new CustomRuntimeException(CustomRuntimeException.PROJECT_NOT_FOUND));

    // Act
    mockMvc.perform(delete("/projects/delete-project?id=" + id))
        .andExpect(status().is4xxClientError())
        .andReturn();

    // Assert
    verify(projectService).deleteProject(id);
    verifyNoMoreInteractions(projectService);
  }

  @Test
  @WithMockUser(username = "user")
  void updateProjectTest() throws Exception {
    // Arrange
    Project projectToUpdate = new Project();
    projectToUpdate.setId("1");
    projectToUpdate.setName("Project 3");
    ProjectDTO projectDTOToUpdate = modelMapper.map(projectToUpdate, ProjectDTO.class);

    when(projectService.updateProject(projectDTOToUpdate)).thenReturn(projectDTOToUpdate);

    // Act
    MvcResult result = mockMvc.perform(put("/projects/update-project")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(projectDTOToUpdate)))
        .andExpect(status().isOk())
        .andReturn();

    // Assert
    String actualResponseBody = result.getResponse().getContentAsString();
    ProjectDTO actualProject = objectMapper.readValue(actualResponseBody, ProjectDTO.class);
    assertEquals(projectDTOToUpdate, actualProject);

    verify(projectService).updateProject(projectDTOToUpdate);
    verifyNoMoreInteractions(projectService);
  }

  @Test
  @WithMockUser(username = "user")
  void updateProjectWhenInvalidFormTest() throws Exception {
    // Arrange
    Project projectToUpdate = new Project();
    projectToUpdate.setId("1");
    projectToUpdate.setName("Project 2");
    ProjectDTO projectDTOToUpdate = modelMapper.map(projectToUpdate, ProjectDTO.class);

    when(projectService.updateProject(projectDTOToUpdate)).thenThrow(new CustomRuntimeException(CustomRuntimeException.PROJECT_NAME_ALREADY_EXISTS));

    // Act
    mockMvc.perform(put("/projects/update-project")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(projectDTOToUpdate)))
        .andExpect(status().is4xxClientError())
        .andReturn();

    // Assert
    verify(projectService).updateProject(projectDTOToUpdate);
    verifyNoMoreInteractions(projectService);
  }

  @Test
  @WithMockUser(username = "cardotcl")
  void addNewAssessmentTest() throws Exception {
    // Arrange
    String projectId = "1";
    AssessmentDTO assessmentDTO = new AssessmentDTO();
    assessmentDTO.setDate(new Date());
    assessmentDTO.setComment("Comment 1");
    assessmentDTO.setTag(TagDTO.INITIAL);

    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setId(projectId);
    projectDTO.setName("Project 1");
    projectDTO.setAssessments(new ArrayList<>());
    projectDTO.getAssessments().add(assessmentDTO);

    TeamDTO team = new TeamDTO();
    ArrayList<UserDTO> members = new ArrayList<>();
    UserDTO user = new UserDTO();

    user.setLogin("cardotcl");
    members.add(user);
    team.setMembers(members);

    projectDTO.setTeam(team);

    when(projectService.isMemberOfProjectTeam(projectId)).thenReturn(true);
    when(projectService.addNewAssessment(projectId, assessmentDTO)).thenReturn(projectDTO);

    // Act
    MvcResult result = mockMvc.perform(post("/projects/add-new-assessment")
            .param("projectId", projectId)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(assessmentDTO)))
        .andExpect(status().isOk())
        .andReturn();

    // Assert
    String actualResponseBody = result.getResponse().getContentAsString();
    ProjectDTO actualProject = objectMapper.readValue(actualResponseBody, ProjectDTO.class);
    assertEquals(projectDTO, actualProject);

    verify(projectService).isMemberOfProjectTeam(projectId);
    verify(projectService).addNewAssessment(projectId, assessmentDTO);
    verifyNoMoreInteractions(projectService);
  }

  @Test
  @WithMockUser(username = "cardotcl")
  void addNewAssessmentWhenInvalidFormTest() throws Exception {
    // Arrange
    String projectId = "1";
    AssessmentDTO assessmentDTO = new AssessmentDTO();

    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setId(projectId);
    projectDTO.setName("Project 1");
    projectDTO.setAssessments(new ArrayList<>());
    projectDTO.getAssessments().add(assessmentDTO);

    TeamDTO team = new TeamDTO();
    ArrayList<UserDTO> members = new ArrayList<>();
    UserDTO user = new UserDTO();

    user.setLogin("cardotcl");
    members.add(user);
    team.setMembers(members);

    projectDTO.setTeam(team);

    when(projectService.isMemberOfProjectTeam(projectId)).thenReturn(true);

    when(projectService.addNewAssessment(projectId, assessmentDTO)).thenThrow(new CustomRuntimeException(CustomRuntimeException.PROJECT_NOT_FOUND));

    // Act
    mockMvc.perform(post("/projects/add-new-assessment")
            .param("projectId", projectId)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(assessmentDTO)))
        .andExpect(status().isNotFound())
        .andReturn();

    // Assert
    verify(projectService).isMemberOfProjectTeam(projectId);
    verify(projectService).addNewAssessment(projectId, assessmentDTO);
    verifyNoMoreInteractions(projectService);
  }

  @Test
  @WithMockUser(username = "cardotcl")
  void addNewAssessmentTestNotMember() throws Exception {
    // Arrange
    String projectId = "1";
    AssessmentDTO assessmentDTO = new AssessmentDTO();

    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setId(projectId);
    projectDTO.setName("Project 1");
    projectDTO.setAssessments(new ArrayList<>());
    projectDTO.getAssessments().add(assessmentDTO);

    TeamDTO team = new TeamDTO();
    ArrayList<UserDTO> members = new ArrayList<>();
    UserDTO user = new UserDTO();

    user.setLogin("ledumaxe");
    members.add(user);
    team.setMembers(members);

    projectDTO.setTeam(team);

    when(projectService.isMemberOfProjectTeam(projectId)).thenReturn(false);

    // Act
    mockMvc.perform(post("/projects/add-new-assessment")
                    .param("projectId", projectId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(assessmentDTO)))
            .andExpect(status().isUnauthorized())
            .andReturn();

    // Assert
    verify(projectService).isMemberOfProjectTeam(projectId);
    verifyNoMoreInteractions(projectService);
  }

  @Test
  @WithMockUser(username = "user")
  void getProjectByIdTest() throws Exception {
    // Arrange
    String id = "1";
    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setId(id);
    projectDTO.setName("Project 1");

    when(projectService.getProjectById(id)).thenReturn(projectDTO);

    // Act
    MvcResult result = mockMvc.perform(get("/projects/get-project-by-id")
            .param("id", id))
        .andExpect(status().isOk())
        .andReturn();

    // Assert
    String actualResponseBody = result.getResponse().getContentAsString();
    ProjectDTO actualProject = objectMapper.readValue(actualResponseBody, ProjectDTO.class);
    assertEquals(projectDTO, actualProject);

    verify(projectService).getProjectById(id);
    verifyNoMoreInteractions(projectService);
  }

  @Test
  @WithMockUser(username = "user")
  void getProjectByIdWhenInvalidIdTest() throws Exception {
    // Arrange
    String id = "invalidId";
    CustomRuntimeException exception = new CustomRuntimeException(CustomRuntimeException.PROJECT_NOT_FOUND);

    when(projectService.getProjectById(id)).thenThrow(exception);

    // Act
    MvcResult result = mockMvc.perform(get("/projects/get-project-by-id")
            .param("id", id))
        .andExpect(status().isNotFound())
        .andReturn();

    // Assert
    assertEquals(exception.getHttpCode().value(), result.getResponse().getStatus());

    verify(projectService).getProjectById(id);
    verifyNoMoreInteractions(projectService);
  }

  @Test
  @WithMockUser(username = "cardotcl")
  void modifyLastAssessmentCommentTest() throws Exception {
    // Arrange
    String projectId = "1";
    String comment = "Comment 1";
    AssessmentDTO assessmentDTO = new AssessmentDTO();
    assessmentDTO.setComment(comment);

    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setId(projectId);
    projectDTO.setName("Project 1");
    projectDTO.setAssessments(new ArrayList<>());
    projectDTO.getAssessments().add(assessmentDTO);

    TeamDTO team = new TeamDTO();
    ArrayList<UserDTO> members = new ArrayList<>();
    UserDTO user = new UserDTO();

    user.setLogin("cardotcl");
    members.add(user);
    team.setMembers(members);

    projectDTO.setTeam(team);

    when(projectService.isMemberOfProjectTeam(projectId)).thenReturn(true);
    when(projectService.modifyLastAssessmentComment(projectId, comment)).thenReturn(projectDTO);

    // Act
    mockMvc.perform(put("/projects/modify-last-assessment-comment")
                    .param("projectId", projectId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(comment))
            .andExpect(status().isOk())
            .andReturn();

    // Assert
    verify(projectService).isMemberOfProjectTeam(projectId);
    verify(projectService).modifyLastAssessmentComment(projectId, comment);
    verifyNoMoreInteractions(projectService);
  }

  @Test
  @WithMockUser(username = "cardotcl")
  void modifyLastAssessmentCommentNotMemberTest() throws Exception {
    // Arrange
    String projectId = "1";
    String comment = "Comment 1";
    AssessmentDTO assessmentDTO = new AssessmentDTO();
    assessmentDTO.setComment(comment);

    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setId(projectId);
    projectDTO.setName("Project 1");
    projectDTO.setAssessments(new ArrayList<>());
    projectDTO.getAssessments().add(assessmentDTO);

    TeamDTO team = new TeamDTO();
    ArrayList<UserDTO> members = new ArrayList<>();
    UserDTO user = new UserDTO();

    user.setLogin("ledumaxe");
    members.add(user);
    team.setMembers(members);

    projectDTO.setTeam(team);

    when(projectService.isMemberOfProjectTeam(projectId)).thenReturn(false);

    // Act
    mockMvc.perform(put("/projects/modify-last-assessment-comment")
                    .param("projectId", projectId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(comment))
            .andExpect(status().isUnauthorized())
            .andReturn();

    // Assert
    verify(projectService).isMemberOfProjectTeam(projectId);
    verifyNoMoreInteractions(projectService);
  }

  @Test
  @WithMockUser(username = "user")
  void modifyLastAssessmentTest() throws Exception {
    // Arrange
    String projectId = "1";
    AssessmentDTO assessmentDTO = new AssessmentDTO();
    assessmentDTO.setDate(new Date());
    assessmentDTO.setComment("Modified Comment");
    assessmentDTO.setTag(TagDTO.DRAFT);

    ProjectDTO projectDTO = new ProjectDTO();
    projectDTO.setId(projectId);
    projectDTO.setName("Project 1");
    projectDTO.setAssessments(new ArrayList<>());
    projectDTO.getAssessments().add(assessmentDTO);

    TeamDTO team = new TeamDTO();
    ArrayList<UserDTO> members = new ArrayList<>();
    UserDTO user = new UserDTO();

    user.setLogin("user");
    members.add(user);
    team.setMembers(members);

    projectDTO.setTeam(team);

    when(projectService.isMemberOfProjectTeam(projectId)).thenReturn(true);
    when(projectService.modifyLastAssessment(projectId, assessmentDTO)).thenReturn(projectDTO);

    // Act
    MvcResult result = mockMvc.perform(put("/projects/modify-last-assessment")
            .param("projectId", projectId)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(assessmentDTO)))
        .andExpect(status().isOk())
        .andReturn();

    // Assert
    String actualResponseBody = result.getResponse().getContentAsString();
    ProjectDTO actualProject = objectMapper.readValue(actualResponseBody, ProjectDTO.class);
    assertEquals(projectDTO, actualProject);

    verify(projectService).isMemberOfProjectTeam(projectId);
    verify(projectService).modifyLastAssessment(projectId, assessmentDTO);
    verifyNoMoreInteractions(projectService);
  }

  @Test
  @WithMockUser(username = "user")
  void modifyLastAssessmentWhenNotMemberOfTeamTest() throws Exception {
    // Arrange
    String projectId = "1";
    AssessmentDTO assessmentDTO = new AssessmentDTO();
    assessmentDTO.setDate(new Date());
    assessmentDTO.setComment("Modified Comment");
    assessmentDTO.setTag(TagDTO.DRAFT);

    when(projectService.isMemberOfProjectTeam(projectId)).thenReturn(false);

    // Act
    mockMvc.perform(put("/projects/modify-last-assessment")
            .param("projectId", projectId)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(assessmentDTO)))
        .andExpect(status().is4xxClientError())
        .andReturn();

    // Assert
    verify(projectService).isMemberOfProjectTeam(projectId);
    verifyNoMoreInteractions(projectService);
  }
}