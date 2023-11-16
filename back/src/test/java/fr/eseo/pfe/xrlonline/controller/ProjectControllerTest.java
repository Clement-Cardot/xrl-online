package fr.eseo.pfe.xrlonline.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.ProjectDTO;
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
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.web.servlet.function.RequestPredicates.param;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class ProjectControllerTest {

  @Autowired
  MockMvc mockMvc;

  @Autowired
  ModelMapper modelMapper;

  @MockBean
  ProjectService projectService;

  ObjectMapper objectMapper = new ObjectMapper();

  List<ProjectDTO> existingProjects;

  @BeforeEach
  public void setUp() {
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
  public void getProjectsTest() throws Exception {
    // Arrange
    when(projectService.getProjects()).thenReturn(existingProjects);

    // Act
    MvcResult result = mockMvc.perform(get("/projects"))
        .andExpect(status().isOk())
        .andReturn();

    // Assert
    String actualResponseBody = result.getResponse().getContentAsString();
    List<ProjectDTO> actualProjects = objectMapper.readValue(actualResponseBody,
        objectMapper.getTypeFactory().constructCollectionType(List.class, ProjectDTO.class));
    assertEquals(existingProjects, actualProjects);

    verify(projectService).getProjects();
    verifyNoMoreInteractions(projectService);
  }

  @Test
  @WithMockUser(username = "user")
  public void createProjectTest() throws Exception {
    Project projectToCreate = new Project();
    projectToCreate.setName("Project 3");
    ProjectDTO projectDTOToCreate = modelMapper.map(projectToCreate, ProjectDTO.class);

    when(projectService.createProject(projectDTOToCreate)).thenReturn(projectDTOToCreate);

    MvcResult result = mockMvc.perform(post("/project")
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
  public void createProjectWhenInvalidFormTest() throws Exception {
    Project projectToCreate = new Project();
    projectToCreate.setName("Project 2");
    ProjectDTO projectDTOToCreate = modelMapper.map(projectToCreate, ProjectDTO.class);

    when(projectService.createProject(projectDTOToCreate)).thenThrow(new CustomRuntimeException(CustomRuntimeException.PROJECT_NAME_ALREADY_EXISTS));

    mockMvc.perform(post("/project")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(projectDTOToCreate)))
        .andExpect(status().is4xxClientError())
        .andReturn();

    verify(projectService).createProject(projectDTOToCreate);
    verifyNoMoreInteractions(projectService);
  }

  @Test
  @WithMockUser(username = "user")
  public void deleteProjectTest() throws Exception {
    // Arrange
    String id = existingProjects.get(0).getId();
    ProjectDTO projectDTOToDelete = existingProjects.get(0);

    when(projectService.deleteProject(id)).thenReturn(projectDTOToDelete);

    // Act
    MvcResult result = mockMvc.perform(delete("/project/" + id))
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
  public void deleteProjectWhenInvalidIdTest() throws Exception {
    // Arrange
    String id = "invalidId";

    when(projectService.deleteProject(id)).thenThrow(new CustomRuntimeException(CustomRuntimeException.PROJECT_NOT_FOUND));

    // Act
    mockMvc.perform(delete("/project/" + id))
        .andExpect(status().is4xxClientError())
        .andReturn();

    // Assert
    verify(projectService).deleteProject(id);
    verifyNoMoreInteractions(projectService);
  }

  @Test
  @WithMockUser(username = "user")
  public void updateProjectTest() throws Exception {
    // Arrange
    Project projectToUpdate = new Project();
    projectToUpdate.setId("1");
    projectToUpdate.setName("Project 3");
    ProjectDTO projectDTOToUpdate = modelMapper.map(projectToUpdate, ProjectDTO.class);

    when(projectService.updateProject(projectDTOToUpdate)).thenReturn(projectDTOToUpdate);

    // Act
    MvcResult result = mockMvc.perform(put("/project")
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
  public void updateProjectWhenInvalidFormTest() throws Exception {
    // Arrange
    Project projectToUpdate = new Project();
    projectToUpdate.setId("1");
    projectToUpdate.setName("Project 2");
    ProjectDTO projectDTOToUpdate = modelMapper.map(projectToUpdate, ProjectDTO.class);

    when(projectService.updateProject(projectDTOToUpdate)).thenThrow(new CustomRuntimeException(CustomRuntimeException.PROJECT_NAME_ALREADY_EXISTS));

    // Act
    mockMvc.perform(put("/project")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(projectDTOToUpdate)))
        .andExpect(status().is4xxClientError())
        .andReturn();

    // Assert
    verify(projectService).updateProject(projectDTOToUpdate);
    verifyNoMoreInteractions(projectService);
  }
}
