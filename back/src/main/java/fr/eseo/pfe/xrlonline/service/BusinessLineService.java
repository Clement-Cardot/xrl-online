package fr.eseo.pfe.xrlonline.service;

import fr.eseo.pfe.xrlonline.model.entity.BusinessLine;
import fr.eseo.pfe.xrlonline.repository.BusinessLineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BusinessLineService {

  @Autowired
  private BusinessLineRepository businessLineRepository;

  public BusinessLine getBusinessLineById(String id) {
    return businessLineRepository.findById(id).orElse(null);
  }

  public List<BusinessLine> getAllBusinessLine() {
    return businessLineRepository.findAll();
  }

  public BusinessLine createBusinessLine() {
    BusinessLine businessLine = new BusinessLine();
    businessLine.setName("Business Line 1");
    return businessLineRepository.save(businessLine);
  }
}
