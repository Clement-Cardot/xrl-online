package fr.eseo.pfe.xrlonline.controller;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.logger.UserLogger;
import fr.eseo.pfe.xrlonline.logger.UserLoggerFactory;
import fr.eseo.pfe.xrlonline.model.dto.BusinessLineDTO;
import fr.eseo.pfe.xrlonline.service.BusinessLineService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200") // Only For Dev
@Log4j2
@RestController
@RequestMapping("/businessLines")
public class BusinessLineController {

  private final BusinessLineService businessLineService;

  UserLogger logger = UserLoggerFactory.getLogger(ProjectController.class, log);

  public BusinessLineController(BusinessLineService businessLineService) {
    this.businessLineService = businessLineService;
  }

  @GetMapping("/get-all-businessLines")
  public ResponseEntity<List<BusinessLineDTO>> getAllBusinessLine() {
    logger.logInfo("REQUEST: Get all businesslines");
    try {
      return businessLineService.getAllBusinessLine();
    } catch (CustomRuntimeException e) {
      logger.logError("Error while trying to get all businesslines, Error Details : {}", e.getMessage());
      return new ResponseEntity<>(e.getHttpCode());
    }
  }

  @GetMapping("/get-businessLine-by-id")
  public ResponseEntity<BusinessLineDTO> getBusinessLineById(@RequestParam String id) {
    logger.logInfo("REQUEST: Get businessline by id with : {}", id);
    try {
      return businessLineService.getBusinessLineById(id);
    } catch (CustomRuntimeException e) {
      logger.logError("Error while trying to get businnesline by id with : {}, Error Details : {}", id, e.getMessage());
      return new ResponseEntity<>(e.getHttpCode());
    }
  }

  @PostMapping("/create-businessLine")
  public ResponseEntity<BusinessLineDTO> createBusinessLine(@RequestBody BusinessLineDTO businessLineDTO) {
    logger.logInfo("REQUEST: Create businessline with {}", businessLineDTO.toString());
    try {
      return businessLineService.createBusinessLine(businessLineDTO);
    } catch (CustomRuntimeException e) {
      logger.logError("Error while trying to create businessline with : {}, Error Details : {}", businessLineDTO, e.getMessage());
      return new ResponseEntity<>(e.getHttpCode());
    }
  }

  @PutMapping("/update-businessLine")
  public ResponseEntity<BusinessLineDTO> updateBusinessLine(@RequestBody BusinessLineDTO businessLineDTO) {
    logger.logInfo("REQUEST: Update businessline with {}", businessLineDTO.toString());
    try {
      return businessLineService.updateBusinessLine(businessLineDTO);
    } catch (CustomRuntimeException e) {
      logger.logError("Error while trying to update businessline with : {}, Error Details : {}", businessLineDTO, e.getMessage());
      return new ResponseEntity<>(e.getHttpCode());
    }
  }

  @DeleteMapping("/delete-businessLine")
  public ResponseEntity<BusinessLineDTO> deleteBusinessLine(@RequestParam String id) {
    logger.logInfo("REQUEST: Delete businessline with id : {}", id);
    try {
      return businessLineService.deleteBusinessLine(id);
    } catch (CustomRuntimeException e) {
      logger.logError("Error while trying to delete businessline with : {}, Error Details : {}", id, e.getMessage());
      return new ResponseEntity<>(e.getHttpCode());
    }
  }

}
