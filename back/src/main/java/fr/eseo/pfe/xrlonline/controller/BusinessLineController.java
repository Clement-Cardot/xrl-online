package fr.eseo.pfe.xrlonline.controller;

import fr.eseo.pfe.xrlonline.model.BusinessLine;
import fr.eseo.pfe.xrlonline.service.BusinessLineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class BusinessLineController {

  @Autowired
  private BusinessLineService businessLineService;

  @GetMapping("/businessLines")
  public List<BusinessLine> getAllBusinessLine() {
    return businessLineService.getAllBusinessLine();
  }

  @GetMapping("/businessLines/{id}")
  public BusinessLine getBusinessLineById(@PathVariable String id) {
    return businessLineService.getBusinessLineById(id);
  }

  @GetMapping("/createbusinessLines")
  public BusinessLine createBusinessLine() {
    return businessLineService.createBusinessLine();
  }
}
