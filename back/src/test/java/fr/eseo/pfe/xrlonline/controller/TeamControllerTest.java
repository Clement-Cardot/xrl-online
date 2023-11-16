package fr.eseo.pfe.xrlonline.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.TeamDTO;
import fr.eseo.pfe.xrlonline.model.entity.User;
import fr.eseo.pfe.xrlonline.service.TeamService;
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

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.when;

@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class TeamControllerTest {

    private MockMvc mockMvc;

    @Mock
    private TeamService teamService;

    @InjectMocks
    private TeamController teamController;

    private TeamDTO teamDTO;

    private TeamDTO badTeamDTO;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(teamController).build();

        teamDTO = new TeamDTO();
        teamDTO.setName("testTeam");
        teamDTO.setMembers(new ArrayList<>());

        TeamDTO nonexistentTeamDTO = new TeamDTO();
        nonexistentTeamDTO.setName("nonexistentTeam");

        badTeamDTO = new TeamDTO();
        badTeamDTO.setName("badTeam");


        List<User> duplicatedUsers = new ArrayList<>();
        User user1 = new User();
        user1.setId("1");
        duplicatedUsers.add(user1);
        User user2 = new User();
        user2.setId("1");
        duplicatedUsers.add(user2);
        badTeamDTO.setMembers(duplicatedUsers);
    }

    @AfterEach
    public void tearDown() {
        reset(teamService);
    }

    @Test
    void testGetTeamById_TeamFound() throws Exception {
        when(teamService.getTeamById("1")).thenReturn(ResponseEntity.ok(teamDTO));

        mockMvc.perform(MockMvcRequestBuilders.get("/teams/get-team-by-id?id=1"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("testTeam"));
    }

    @Test
    void testGetTeamById_TeamNotFound() throws Exception {
        when(teamService.getTeamById("1")).thenThrow(new CustomRuntimeException(CustomRuntimeException.TEAM_NOT_FOUND));

        mockMvc.perform(MockMvcRequestBuilders.get("/team/get-team-by-id?id=1"))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    void testGetAllTeam_TeamFound() throws Exception {
        when(teamService.getAllTeam()).thenReturn(ResponseEntity.ok(Collections.singletonList(teamDTO)));

        mockMvc.perform(MockMvcRequestBuilders.get("/teams/get-all-teams"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").value("testTeam"));
    }

    @Test
    void testGetAllTeam_TeamNotFound() throws Exception {
        when(teamService.getAllTeam()).thenThrow(new CustomRuntimeException(CustomRuntimeException.TEAM_LIST_EMPTY));

        mockMvc.perform(MockMvcRequestBuilders.get("/teams/get-all-teams"))
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }

    @Test
    void testCreateTeam_TeamCreated() throws Exception {
        when(teamService.createTeam(teamDTO)).thenReturn(ResponseEntity.ok(teamDTO));

        mockMvc.perform(MockMvcRequestBuilders.post("/teams/create-team")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(teamDTO)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("testTeam"));
    }

    @Test
    void testCreateTeam_TeamNameAlreadyExists() throws Exception {
        when(teamService.createTeam(teamDTO)).thenThrow(new CustomRuntimeException(CustomRuntimeException.TEAM_NAME_ALREADY_EXISTS));

        mockMvc.perform(MockMvcRequestBuilders.post("/teams/create-team")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(teamDTO)))
                .andExpect(MockMvcResultMatchers.status().isConflict());
    }

    @Test
    void testUpdateTeam_TeamUpdated() throws Exception {
        when(teamService.updateTeam(teamDTO)).thenReturn(ResponseEntity.ok(teamDTO));

        mockMvc.perform(MockMvcRequestBuilders.put("/teams/update-team")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(teamDTO)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("testTeam"));
    }

    @Test
    void testUpdateTeam_TeamNotFound() throws Exception {
        when(teamService.updateTeam(teamDTO)).thenThrow(new CustomRuntimeException(CustomRuntimeException.TEAM_NOT_FOUND));

        mockMvc.perform(MockMvcRequestBuilders.put("/teams/update-team")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(teamDTO)))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    void testUpdateTeam_DuplicateMembers() throws Exception {

        when(teamService.updateTeam(badTeamDTO)).thenThrow(new CustomRuntimeException(CustomRuntimeException.DUPLICATE_MEMBERS));

        mockMvc.perform(MockMvcRequestBuilders.put("/teams/update-team")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(badTeamDTO)))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    void testDeleteTeam_TeamDeleted() throws Exception {
        when(teamService.deleteTeam("1")).thenReturn(ResponseEntity.ok(teamDTO));

        mockMvc.perform(MockMvcRequestBuilders.delete("/teams/delete-team?id=1"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("testTeam"));
    }

    @Test
    void testDeleteTeam_TeamNotFound() throws Exception {
        when(teamService.deleteTeam("1")).thenThrow(new CustomRuntimeException(CustomRuntimeException.TEAM_NOT_FOUND));

        mockMvc.perform(MockMvcRequestBuilders.delete("/teams/delete-team?id=1"))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

}

