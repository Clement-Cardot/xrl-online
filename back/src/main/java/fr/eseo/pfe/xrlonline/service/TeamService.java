package fr.eseo.pfe.xrlonline.service;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.TeamDTO;
import fr.eseo.pfe.xrlonline.model.entity.Team;
import fr.eseo.pfe.xrlonline.model.entity.User;
import fr.eseo.pfe.xrlonline.repository.TeamRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private ModelMapper modelMapper;

    public ResponseEntity<TeamDTO> getTeamById(String id) throws CustomRuntimeException {
        Team team = teamRepository.findById(id).orElse(null);
        TeamDTO teamDTO = modelMapper.map(team, TeamDTO.class);
        if (team != null) {
            return ResponseEntity.ok(teamDTO);
        }
        throw new CustomRuntimeException(CustomRuntimeException.TEAM_NOT_FOUND);
    }

    public ResponseEntity<List<TeamDTO>> getAllTeam() throws CustomRuntimeException {
        List<TeamDTO> teamsDTO = teamRepository.findAll().stream()
                .map(team -> modelMapper.map(team, TeamDTO.class))
                .toList();
        if (teamsDTO.isEmpty()) {
            throw new CustomRuntimeException(CustomRuntimeException.TEAM_LIST_EMPTY);
        } else {
            return ResponseEntity.ok(teamsDTO);
        }
    }

    public ResponseEntity<TeamDTO> createTeam(TeamDTO teamDTO) throws CustomRuntimeException {
        if (teamDTO.getName() == null) {
            throw new CustomRuntimeException(CustomRuntimeException.TEAM_NAME_NULL);
        }
        if (teamDTO.getMembers() == null) {
            teamDTO.setMembers(new ArrayList<>());
        }
        Team teamToSave = modelMapper.map(teamDTO, Team.class);
        if (teamRepository.findByName(teamToSave.getName()) != null) {
            throw new CustomRuntimeException(CustomRuntimeException.TEAM_NAME_ALREADY_EXISTS);
        }
        if (teamToSave.getMembers() == null) {
            teamToSave.setMembers(new ArrayList<>());
        }
        Team teamSaved = teamRepository.save(teamToSave);
        return ResponseEntity.ok(modelMapper.map(teamSaved, TeamDTO.class));
    }

    // Utility method to check for duplicate members
    protected boolean hasDuplicateMembers(List<User> members) {
        Set<String> uniqueUserIds = new HashSet<>();
        for (User user : members) {
            String userId = user.getId(); // Assuming User has a method getId() to get a unique identifier
            if (!uniqueUserIds.add(userId)) {
                return true; // Return true if a duplicate member is found
            }
        }
        return false; // Return false if there are no duplicate members
    }



    public ResponseEntity<TeamDTO> updateTeam(TeamDTO updatedTeamDTO) throws CustomRuntimeException {
        // Check if the ID corresponds to an existing team
        Team existingTeam = teamRepository.findById(updatedTeamDTO.getId()).orElse(null);
        if (existingTeam == null) {
            throw new CustomRuntimeException(CustomRuntimeException.TEAM_NOT_FOUND);
        }

        // Check if the updated team's name matches an existing team's name
        Team teamWithUpdatedName = teamRepository.findByName(updatedTeamDTO.getName());
        if (teamWithUpdatedName != null && !teamWithUpdatedName.getId().equals(updatedTeamDTO.getId())) {
            throw new CustomRuntimeException(CustomRuntimeException.TEAM_NAME_ALREADY_EXISTS);
        }

        // Check if there are duplicate users in the members
        List<User> updatedMembers = updatedTeamDTO.getMembers();
        if (hasDuplicateMembers(updatedMembers)) {
            throw new CustomRuntimeException(CustomRuntimeException.DUPLICATE_MEMBERS);
        }

        // Update the team if all conditions are met
        existingTeam.setName(updatedTeamDTO.getName());
        existingTeam.setMembers(updatedMembers);
        Team updatedTeam = teamRepository.save(existingTeam);

        // Update and return the DTO
        updatedTeamDTO = modelMapper.map(updatedTeam, TeamDTO.class);
        return ResponseEntity.ok(updatedTeamDTO);
    }



    public ResponseEntity<TeamDTO> deleteTeam(String id) throws CustomRuntimeException {
        Team teamToDelete = teamRepository.findById(id).orElse(null);
        if (teamToDelete == null) {
            throw new CustomRuntimeException(CustomRuntimeException.TEAM_NOT_FOUND);
        }
        teamRepository.delete(teamToDelete);
        return ResponseEntity.ok(modelMapper.map(teamToDelete, TeamDTO.class));
    }
}