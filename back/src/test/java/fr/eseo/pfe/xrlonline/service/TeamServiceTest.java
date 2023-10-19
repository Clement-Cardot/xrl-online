package fr.eseo.pfe.xrlonline.service;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.TeamDTO;
import fr.eseo.pfe.xrlonline.model.entity.Team;
import fr.eseo.pfe.xrlonline.model.entity.User;
import fr.eseo.pfe.xrlonline.repository.TeamRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TeamServiceTest {

    @InjectMocks
    private TeamService teamService;

    @Mock
    private TeamRepository teamRepository;

    @Mock
    private ModelMapper modelMapper;

    @Test
    void testGetTeamById_TeamFound() throws CustomRuntimeException {
        Team team = new Team();
        team.setId("1");
        team.setName("testTeam");
        team.setMembers(new ArrayList<>());

        TeamDTO teamDTO = new TeamDTO();
        teamDTO.setId("1");
        teamDTO.setName("testTeam");
        teamDTO.setMembers(new ArrayList<>());

        when(teamRepository.findById("1")).thenReturn(Optional.of(team));
        when(modelMapper.map(team, TeamDTO.class)).thenReturn(teamDTO);

        ResponseEntity<TeamDTO> response = teamService.getTeamById("1");

        assertEquals(ResponseEntity.ok(teamDTO), response, "Team found");
    }

    @Test
    void testGetTeamById_TeamNotFound() {
        when(teamRepository.findById("1")).thenReturn(Optional.empty());

        try {
            teamService.getTeamById("1");
        } catch (CustomRuntimeException e) {
            assertEquals(CustomRuntimeException.TEAM_NOT_FOUND, e.getMessage(), "Team not found");
        }
    }

    @Test
    void testGetAllTeam_TeamFound() throws CustomRuntimeException {
        List<Team> teams = new ArrayList<>();
        Team team = new Team();
        team.setId("1");
        team.setName("testTeam");
        team.setMembers(new ArrayList<>());
        teams.add(team);

        List<TeamDTO> teamsDTO = new ArrayList<>();
        TeamDTO teamDTO = new TeamDTO();
        teamDTO.setId("1");
        teamDTO.setName("testTeam");
        teamDTO.setMembers(new ArrayList<>());
        teamsDTO.add(teamDTO);

        when(teamRepository.findAll()).thenReturn(teams);
        when(modelMapper.map(team, TeamDTO.class)).thenReturn(teamDTO);

        ResponseEntity<List<TeamDTO>> response = teamService.getAllTeam();

        assertEquals(ResponseEntity.ok(teamsDTO), response, "Teams found");
    }

    @Test
    void testGetAllTeam_TeamNotFound() {
        when(teamRepository.findAll()).thenReturn(new ArrayList<>());

        try {
            teamService.getAllTeam();
        } catch (CustomRuntimeException e) {
            assertEquals(CustomRuntimeException.TEAM_LIST_EMPTY, e.getMessage(), "Teams not found");
        }
    }

    @Test
    void testCreateTeam_TeamCreated() throws CustomRuntimeException {
        Team team = new Team();
        team.setId("1");
        team.setName("testTeam");
        team.setMembers(new ArrayList<>());

        TeamDTO teamDTO = new TeamDTO();
        teamDTO.setId("1");
        teamDTO.setName("testTeam");
        teamDTO.setMembers(new ArrayList<>());

        when(modelMapper.map(teamDTO, Team.class)).thenReturn(team);
        when(teamRepository.findByName(team.getName())).thenReturn(null);
        when(teamRepository.save(team)).thenReturn(team);
        when(modelMapper.map(team, TeamDTO.class)).thenReturn(teamDTO);

        ResponseEntity<TeamDTO> response = teamService.createTeam(teamDTO);

        assertEquals(ResponseEntity.ok(teamDTO), response, "Team created");
    }

    @Test
    void testCreateTeam_TeamAlreadyExists() {
        Team team = new Team();
        team.setId("1");
        team.setName("testTeam");
        team.setMembers(new ArrayList<>());

        TeamDTO teamDTO = new TeamDTO();
        teamDTO.setId("1");
        teamDTO.setName("testTeam");
        teamDTO.setMembers(new ArrayList<>());

        when(modelMapper.map(teamDTO, Team.class)).thenReturn(team);
        when(teamRepository.findByName(team.getName())).thenReturn(team);

        try {
            teamService.createTeam(teamDTO);
        } catch (CustomRuntimeException e) {
            assertEquals(CustomRuntimeException.TEAM_NAME_ALREADY_EXISTS, e.getMessage(), "Team already exists");
        }
    }

    @Test
    void testCreateTeam_TeamNameNull() {
        TeamDTO teamDTO = new TeamDTO();
        teamDTO.setId("1");
        teamDTO.setName(null);
        teamDTO.setMembers(new ArrayList<>());

        try {
            teamService.createTeam(teamDTO);
        } catch (CustomRuntimeException e) {
            assertEquals(CustomRuntimeException.TEAM_NAME_NULL, e.getMessage(), "Team name null");
        }
    }

    @Test
    void testUpdateTeam_TeamUpdated() throws CustomRuntimeException {
        Team team = new Team();
        team.setId("1");
        team.setName("testTeam");
        team.setMembers(new ArrayList<>());

        TeamDTO teamDTO = new TeamDTO();
        teamDTO.setId("1");
        teamDTO.setName("testTeam");
        teamDTO.setMembers(new ArrayList<>());

        when(teamRepository.findById(teamDTO.getId())).thenReturn(Optional.of(team));
        when(teamRepository.findByName(teamDTO.getName())).thenReturn(null);
        when(teamRepository.save(team)).thenReturn(team);
        when(modelMapper.map(team, TeamDTO.class)).thenReturn(teamDTO);

        ResponseEntity<TeamDTO> response = teamService.updateTeam(teamDTO);

        assertEquals(ResponseEntity.ok(teamDTO), response, "Team updated");
    }

    @Test
    void testUpdateTeam_TeamNotFound() {
        Team team = new Team();
        team.setId("1");
        team.setName("testTeam");
        team.setMembers(new ArrayList<>());

        TeamDTO teamDTO = new TeamDTO();
        teamDTO.setId("1");
        teamDTO.setName("testTeam");
        teamDTO.setMembers(new ArrayList<>());

        when(teamRepository.findById(teamDTO.getId())).thenReturn(Optional.empty());

        try {
            teamService.updateTeam(teamDTO);
        } catch (CustomRuntimeException e) {
            assertEquals(CustomRuntimeException.TEAM_NOT_FOUND, e.getMessage(), "Team not found");
        }
    }

    @Test
    void testUpdateTeam_TeamNameAlreadyExists() {
        Team team = new Team();
        team.setId("1");
        team.setName("testTeam");
        team.setMembers(new ArrayList<>());

        TeamDTO teamDTO = new TeamDTO();
        teamDTO.setId("1");
        teamDTO.setName("testTeam");
        teamDTO.setMembers(new ArrayList<>());

        Team teamWithUpdatedName = new Team();
        teamWithUpdatedName.setId("2");
        teamWithUpdatedName.setName("testTeam");
        teamWithUpdatedName.setMembers(new ArrayList<>());

        when(teamRepository.findById(teamDTO.getId())).thenReturn(Optional.of(team));
        when(teamRepository.findByName(teamDTO.getName())).thenReturn(teamWithUpdatedName);

        try {
            teamService.updateTeam(teamDTO);
        } catch (CustomRuntimeException e) {
            assertEquals(CustomRuntimeException.TEAM_NAME_ALREADY_EXISTS, e.getMessage(), "Team name already exists");
        }
    }

    @Test
    void testUpdateTeam_DuplicateMembers() {
        Team team = new Team();
        team.setId("1");
        team.setName("testTeam");
        team.setMembers(new ArrayList<>());

        TeamDTO teamDTO = new TeamDTO();
        teamDTO.setId("1");
        teamDTO.setName("testTeam");
        teamDTO.setMembers(new ArrayList<>());

        List<User> members = new ArrayList<>();
        User user1 = new User();
        user1.setId("1");
        members.add(user1);
        User user2 = new User();
        user2.setId("1");
        members.add(user2);
        teamDTO.setMembers(members);

        when(teamRepository.findById(teamDTO.getId())).thenReturn(Optional.of(team));
        when(teamRepository.findByName(teamDTO.getName())).thenReturn(null);

        try {
            teamService.updateTeam(teamDTO);
        } catch (CustomRuntimeException e) {
            assertEquals(CustomRuntimeException.DUPLICATE_MEMBERS, e.getMessage(), "Duplicate members");
        }
    }



    @Test
    void testDeleteTeam_TeamDeleted() throws CustomRuntimeException {
        Team team = new Team();
        team.setId("1");
        team.setName("testTeam");
        team.setMembers(new ArrayList<>());

        TeamDTO teamDTO = new TeamDTO();
        teamDTO.setId("1");
        teamDTO.setName("testTeam");
        teamDTO.setMembers(new ArrayList<>());

        when(teamRepository.findById(teamDTO.getId())).thenReturn(Optional.of(team));
        when(modelMapper.map(team, TeamDTO.class)).thenReturn(teamDTO);

        ResponseEntity<TeamDTO> response = teamService.deleteTeam(teamDTO.getId());

        assertEquals(ResponseEntity.ok(teamDTO), response, "Team deleted");
    }

    @Test
    void testDeleteTeam_TeamNotFound() {
        when(teamRepository.findById("1")).thenReturn(Optional.empty());

        try {
            teamService.deleteTeam("1");
        } catch (CustomRuntimeException e) {
            assertEquals(CustomRuntimeException.TEAM_NOT_FOUND, e.getMessage(), "Team not found");
        }
    }
}