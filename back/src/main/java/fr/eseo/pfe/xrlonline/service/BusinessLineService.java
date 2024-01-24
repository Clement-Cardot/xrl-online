package fr.eseo.pfe.xrlonline.service;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.BusinessLineDTO;
import fr.eseo.pfe.xrlonline.model.entity.BusinessLine;
import fr.eseo.pfe.xrlonline.model.entity.Project;
import fr.eseo.pfe.xrlonline.repository.BusinessLineRepository;
import fr.eseo.pfe.xrlonline.repository.ProjectRepository;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BusinessLineService {

  private final BusinessLineRepository businessLineRepository;
  private final ProjectRepository projectRepository;
  private ModelMapper modelMapper;

  public BusinessLineService(BusinessLineRepository businessLineRepository, ModelMapper modelMapper, ProjectRepository projectRepository) {
    this.businessLineRepository = businessLineRepository;
    this.modelMapper = modelMapper;
    this.projectRepository = projectRepository;
  }

  public ResponseEntity<BusinessLineDTO> getBusinessLineById(String id) throws CustomRuntimeException {
    BusinessLine businessLine = businessLineRepository.findById(id).orElse(null);
    BusinessLineDTO businessLineDTO = modelMapper.map(businessLine, BusinessLineDTO.class);

    if (businessLine != null) {
      return ResponseEntity.ok(businessLineDTO);
    }
    throw new CustomRuntimeException(CustomRuntimeException.BUSINESS_LINE_NOT_FOUND);
  }

  public ResponseEntity<BusinessLineDTO> getBusinessLineByName(String name) throws CustomRuntimeException {
    BusinessLine businessLine = businessLineRepository.findByName(name);

    if (businessLine != null) {
      BusinessLineDTO businessLineDTO = modelMapper.map(businessLine, BusinessLineDTO.class);
      return ResponseEntity.ok(businessLineDTO);
    }

    throw new CustomRuntimeException(CustomRuntimeException.BUSINESS_LINE_NOT_FOUND);
  }

  public ResponseEntity<List<BusinessLineDTO>> getAllBusinessLine() throws CustomRuntimeException {
    List<BusinessLineDTO> businessLineDTO = businessLineRepository.findAll().stream()
            .map(businessLine -> modelMapper.map(businessLine, BusinessLineDTO.class))
            .collect(Collectors.toList());

    if (!businessLineDTO.isEmpty()) {
      return ResponseEntity.ok(businessLineDTO);
    }
    throw new CustomRuntimeException(CustomRuntimeException.BUSINESS_LINE_LIST_EMPTY);

  }

  public ResponseEntity<BusinessLineDTO> createBusinessLine(BusinessLineDTO businessLineDTO) throws CustomRuntimeException {
    if(businessLineDTO.getName() == null) {
      throw new CustomRuntimeException(CustomRuntimeException.BUSINESS_LINE_NAME_NULL);
    }

    businessLineDTO.setId(null);

    BusinessLine businessLineToSave = modelMapper.map(businessLineDTO, BusinessLine.class);

    if (businessLineRepository.findByName(businessLineDTO.getName()) == null) {
      BusinessLine businessLineSaved = businessLineRepository.save(businessLineToSave);
      BusinessLineDTO businessLineDTOSaved = modelMapper.map(businessLineSaved, BusinessLineDTO.class);
      return ResponseEntity.ok(businessLineDTOSaved);
    }

    throw new CustomRuntimeException(CustomRuntimeException.BUSINESS_LINE_NAME_ALREADY_EXISTS);
  }

  public ResponseEntity<BusinessLineDTO> updateBusinessLine(BusinessLineDTO updatedBusinessLine) throws CustomRuntimeException {
    BusinessLine existingBusinessLine = businessLineRepository.findById(updatedBusinessLine.getId()).orElse(null);

    if (existingBusinessLine != null) {

      if (businessLineRepository.findByName(updatedBusinessLine.getName()) != null && !existingBusinessLine.getName().equals(updatedBusinessLine.getName())) {
        throw new CustomRuntimeException(CustomRuntimeException.BUSINESS_LINE_NAME_ALREADY_EXISTS);
      }

      existingBusinessLine.setName(updatedBusinessLine.getName() == null ? existingBusinessLine.getName() : updatedBusinessLine.getName());
      BusinessLine businessLineUpdated = businessLineRepository.save(existingBusinessLine);
      BusinessLineDTO businessLineUpdatedDTO = modelMapper.map(businessLineUpdated, BusinessLineDTO.class);
      return ResponseEntity.ok(businessLineUpdatedDTO);
    }
    throw new CustomRuntimeException(CustomRuntimeException.BUSINESS_LINE_NOT_FOUND);
  }

  public ResponseEntity<BusinessLineDTO> deleteBusinessLine(String id) throws CustomRuntimeException {
    BusinessLine businessLineToDelete = businessLineRepository.findById(id).orElse(null);
    BusinessLineDTO businessLineToDeleteDTO = modelMapper.map(businessLineToDelete, BusinessLineDTO.class);

    if (businessLineToDelete != null) {
      List<Project> projects = projectRepository.findAll();
      for (Project project : projects) {
        if (project.getBusinessLine().getId().equals(id)) {
          throw new CustomRuntimeException(CustomRuntimeException.BUSINESS_LINE_NOT_DELETABLE);
        }
      }
      businessLineRepository.delete(businessLineToDelete);
      return ResponseEntity.ok(businessLineToDeleteDTO);
    }
    throw new CustomRuntimeException(CustomRuntimeException.BUSINESS_LINE_NOT_FOUND);
  }

}
