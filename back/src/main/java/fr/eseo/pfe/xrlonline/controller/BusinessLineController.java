package fr.eseo.pfe.xrlonline.controller;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.BusinessLineDTO;
import fr.eseo.pfe.xrlonline.service.BusinessLineService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200") // Only For Dev
@Log4j2
@RestController
@RequestMapping("/businessLines")
public class BusinessLineController {

  private final BusinessLineService businessLineService;

  public BusinessLineController(BusinessLineService businessLineService) {
    this.businessLineService = businessLineService;
  }

  @GetMapping("/get-all-businessLines")
  public ResponseEntity<List<BusinessLineDTO>> getAllBusinessLine(@CurrentSecurityContext(expression="authentication?.name") String username) {
    log.info("AS [{}] REQUEST: Get all businesslines", username);
    try {
      return businessLineService.getAllBusinessLine();
    } catch (CustomRuntimeException e) {
      log.error("AS [{}] Error while trying to get all businesslines, Error Details : {}",username ,e.getMessage());
      return new ResponseEntity<>(e.getHttpCode());
    }
  }

  @GetMapping("/get-businessLine-by-id")
  public ResponseEntity<BusinessLineDTO> getBusinessLineById(@CurrentSecurityContext(expression="authentication?.name") String username, @RequestParam String id) {
    log.info("AS [{}] REQUEST: Get businessline by id with : {}", username, id);
    try {
      return businessLineService.getBusinessLineById(id);
    } catch (CustomRuntimeException e) {
      log.error("AS [{}] Error while trying to get businnesline by id with : {}, Error Details : {}", username, id, e.getMessage());
      return new ResponseEntity<>(e.getHttpCode());
    }
  }

  @PostMapping("/create-businessLine")
  public ResponseEntity<BusinessLineDTO> createBusinessLine(@CurrentSecurityContext(expression="authentication?.name") String username, @RequestBody BusinessLineDTO businessLineDTO) {
    log.info("AS [{}] REQUEST: Create businessline with {}", username, businessLineDTO.toString());
    try {
      return businessLineService.createBusinessLine(businessLineDTO);
    } catch (CustomRuntimeException e) {
      log.error("AS [{}] Error while trying to create businessline with : {}, Error Details : {}", username, businessLineDTO, e.getMessage());
      return new ResponseEntity<>(e.getHttpCode());
    }
  }

  @PutMapping("/update-businessLine")
  public ResponseEntity<BusinessLineDTO> updateBusinessLine(@CurrentSecurityContext(expression="authentication?.name") String username, @RequestBody BusinessLineDTO businessLineDTO) {
    log.info("AS [{}] REQUEST: Update businessline with {}", username, businessLineDTO.toString());
    try {
      return businessLineService.updateBusinessLine(businessLineDTO);
    } catch (CustomRuntimeException e) {
      log.error("AS [{}] Error while trying to update businessline with : {}, Error Details : {}", username, businessLineDTO, e.getMessage());
      return new ResponseEntity<>(e.getHttpCode());
    }
  }

  @DeleteMapping("/delete-businessLine")
  public ResponseEntity<BusinessLineDTO> deleteBusinessLine(@CurrentSecurityContext(expression="authentication?.name") String username, @RequestParam String id) {
    log.info("AS [{}] REQUEST: Delete businessline with id : {}", username, id);
    try {
      return businessLineService.deleteBusinessLine(id);
    } catch (CustomRuntimeException e) {
      log.error("AS [{}] Error while trying to delete businessline with : {}, Error Details : {}", username, id, e.getMessage());
      return new ResponseEntity<>(e.getHttpCode());
    }
  }

}
