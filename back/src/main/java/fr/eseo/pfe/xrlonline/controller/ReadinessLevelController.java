package fr.eseo.pfe.xrlonline.controller;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import fr.eseo.pfe.xrlonline.logger.UserLogger;
import fr.eseo.pfe.xrlonline.logger.UserLoggerFactory;
import fr.eseo.pfe.xrlonline.model.dto.ReadinessLevelDTO;
import fr.eseo.pfe.xrlonline.service.ReadinessLevelService;
import lombok.extern.log4j.Log4j2;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@Log4j2
@RequestMapping("/readiness-levels")
public class ReadinessLevelController {

    private final ReadinessLevelService readinessLevelService;

    UserLogger logger = UserLoggerFactory.getLogger(ReadinessLevelController.class, log);

    public ReadinessLevelController(ReadinessLevelService readinessLevelService) {
        this.readinessLevelService = readinessLevelService;
    }

    @GetMapping("/get-all-readiness-levels")
    public ResponseEntity<List<ReadinessLevelDTO>> getAllReadinessLevel() {
        logger.logInfo("REQUEST: Get all readiness levels");
        try {
            return readinessLevelService.getAllReadinessLevel();
        } catch (CustomRuntimeException e) {
            logger.logError("Error while trying to get all readiness levels, Error Details : {}", e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    @GetMapping("/get-readiness-level-by-id")
    public ResponseEntity<ReadinessLevelDTO> getReadinessLevelById(@RequestParam String id) {
        logger.logInfo("REQUEST: Get readiness level by id with : {}", id);
        try {
            return readinessLevelService.getReadinessLevelById(id);
        } catch (CustomRuntimeException e) {
            logger.logError("Error while trying to get readiness level with this ID : {}, Error Details : {}", id,
                    e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    @PostMapping("/create-readiness-level")
    public ResponseEntity<ReadinessLevelDTO> createReadinessLevel(@RequestBody ReadinessLevelDTO readinessLevelDTO) {
        logger.logInfo("REQUEST: Create readiness level with : {}", readinessLevelDTO.toString());
        try {
            return readinessLevelService.createReadinessLevel(readinessLevelDTO);
        } catch (CustomRuntimeException e) {
            logger.logError("Error while trying to create readiness level with this name : {}, Error Details : {}",
                    readinessLevelDTO.getName(), e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    @PutMapping("/update-readiness-level")
    public ResponseEntity<ReadinessLevelDTO> updateReadinessLevel(@RequestBody ReadinessLevelDTO readinessLevelDTO) {
        logger.logInfo("REQUEST: Update readiness level with : {}", readinessLevelDTO.toString());
        try {
            return readinessLevelService.updateReadinessLevel(readinessLevelDTO);
        } catch (CustomRuntimeException e) {
            logger.logError("Error while trying to update readiness level with this ID : {}, Error Details : {}",
                    readinessLevelDTO.getId(), e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }
}
