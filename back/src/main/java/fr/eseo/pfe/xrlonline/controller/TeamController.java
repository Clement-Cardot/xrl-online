package fr.eseo.pfe.xrlonline.controller;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.TeamDTO;
import fr.eseo.pfe.xrlonline.service.TeamService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class TeamController {

    Logger logger = LoggerFactory.getLogger(TeamController.class);

    @Autowired
    private TeamService teamService;

    @GetMapping("/teams")
    public ResponseEntity<List<TeamDTO>> getAllTeam() {
        logger.info("REQUEST: Get all teams");
        try{
            return teamService.getAllTeam();
        } catch (CustomRuntimeException e) {
            logger.error("Error while trying to get all teams, Error Details : {}", e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    @GetMapping("/team")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<TeamDTO> getTeamById(@RequestParam String id) {
        logger.info("REQUEST: Get team by id");
        try{
            return teamService.getTeamById(id);
        } catch (CustomRuntimeException e) {
            logger.error("Error while trying to get team with this ID : {}, Error Details : {}", id, e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    @PostMapping("/create-team")
    public ResponseEntity<TeamDTO> createTeam(@RequestBody TeamDTO teamDTO) {
        logger.info("REQUEST: Create team");
        try{
            return teamService.createTeam(teamDTO);
        } catch (CustomRuntimeException e) {
            logger.error("Error while trying to create team with this name : {}, Error Details : {}", teamDTO.getName(), e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    @PutMapping("/update-team")
    public ResponseEntity<TeamDTO> updateTeam(@RequestBody TeamDTO teamDTO) {
        logger.info("REQUEST: Update team");
        try{
            return teamService.updateTeam(teamDTO);
        } catch (CustomRuntimeException e) {
            logger.error("Error while trying to update team with this ID : {}, Error Details : {}", teamDTO.getId(), e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    @DeleteMapping("/delete-team")
    public ResponseEntity<TeamDTO> deleteTeam(@RequestParam String id) {
        logger.info("REQUEST: Delete team");
        try{
            return teamService.deleteTeam(id);
        } catch (CustomRuntimeException e) {
            logger.error("Error while trying to delete team with this ID : {}, Error Details : {}", id, e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

}
