package fr.eseo.pfe.xrlonline.controller;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.TeamDTO;
import fr.eseo.pfe.xrlonline.service.TeamService;
import lombok.extern.log4j.Log4j2;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200") // Only For Dev
@Log4j2
@RestController
@RequestMapping("/teams")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping("/get-all-teams")
    public ResponseEntity<List<TeamDTO>> getAllTeam(@CurrentSecurityContext(expression="authentication?.name") String username) {
        log.info("AS [{}] REQUEST: Get all teams", username);
        try{
            return teamService.getAllTeam();
        } catch (CustomRuntimeException e) {
            log.error("AS [{}] Error while trying to get all teams, Error Details : {}", username, e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    @GetMapping("/get-team-by-id")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<TeamDTO> getTeamById(@RequestParam String id, @CurrentSecurityContext(expression="authentication?.name") String username) {
        log.info("AS [{}] REQUEST: Get team by id with : {}", username, id);
        try{
            return teamService.getTeamById(id);
        } catch (CustomRuntimeException e) {
            log.error("AS [{}] Error while trying to get team with this ID : {}, Error Details : {}", username, id, e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    @PostMapping("/create-team")
    public ResponseEntity<TeamDTO> createTeam(@RequestBody TeamDTO teamDTO, @CurrentSecurityContext(expression="authentication?.name") String username) {
        log.info("AS [{}] REQUEST: Create team with : {}", username, teamDTO.toString());
        try{
            return teamService.createTeam(teamDTO);
        } catch (CustomRuntimeException e) {
            log.error("AS [{}] Error while trying to create team with this name : {}, Error Details : {}", username, teamDTO.getName(), e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    @PutMapping("/update-team")
    public ResponseEntity<TeamDTO> updateTeam(@RequestBody TeamDTO teamDTO, @CurrentSecurityContext(expression="authentication?.name") String username) {
        log.info("AS [{}] REQUEST: Update team with : {}", username, teamDTO.toString());
        try{
            return teamService.updateTeam(teamDTO);
        } catch (CustomRuntimeException e) {
            log.error("AS [{}] Error while trying to update team with this ID : {}, Error Details : {}", username, teamDTO.getId(), e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    @DeleteMapping("/delete-team")
    public ResponseEntity<TeamDTO> deleteTeam(@RequestParam String id, @CurrentSecurityContext(expression="authentication?.name") String username) {
        log.info("AS [{}] REQUEST: Delete team with id : {}", username, id);
        try{
            return teamService.deleteTeam(id);
        } catch (CustomRuntimeException e) {
            log.error("AS [{}] Error while trying to delete team with this ID : {}, Error Details : {}", username, id, e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

}
