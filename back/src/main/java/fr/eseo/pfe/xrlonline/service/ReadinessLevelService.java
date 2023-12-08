package fr.eseo.pfe.xrlonline.service;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.ReadinessLevelDTO;
import fr.eseo.pfe.xrlonline.model.entity.ReadinessLevel;
import fr.eseo.pfe.xrlonline.repository.ReadinessLevelRepository;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReadinessLevelService {

    private final ReadinessLevelRepository readinessLevelRepository;

    private final ModelMapper modelMapper;

    public ReadinessLevelService(ReadinessLevelRepository readinessLevelRepository, ModelMapper modelMapper) {
        this.readinessLevelRepository = readinessLevelRepository;
        this.modelMapper = modelMapper;
    }

    public ResponseEntity<ReadinessLevelDTO> getReadinessLevelById(String id) throws CustomRuntimeException {
        ReadinessLevel readinessLevel = readinessLevelRepository.findById(id).orElse(null);
        if (readinessLevel != null) {
            ReadinessLevelDTO readinessLevelDTO = modelMapper.map(readinessLevel, ReadinessLevelDTO.class);
            return ResponseEntity.ok(readinessLevelDTO);
        }
        throw new CustomRuntimeException(CustomRuntimeException.READINESS_LEVEL_NOT_FOUND);
    }

    public ResponseEntity<List<ReadinessLevelDTO>> getAllReadinessLevel() throws CustomRuntimeException {
        List<ReadinessLevelDTO> readinessLevelsDTO = readinessLevelRepository.findAll().stream()
                .map(readinessLevel -> modelMapper.map(readinessLevel, ReadinessLevelDTO.class))
                .toList();
        if (readinessLevelsDTO.isEmpty()) {
            throw new CustomRuntimeException(CustomRuntimeException.READINESS_LEVEL_LIST_EMPTY);
        }
        return ResponseEntity.ok(readinessLevelsDTO);
    }

    public ResponseEntity<ReadinessLevelDTO> createReadinessLevel(ReadinessLevelDTO readinessLevelDTO)
            throws CustomRuntimeException {
        if (readinessLevelDTO.getName() == null) {
            throw new CustomRuntimeException(CustomRuntimeException.READINESS_LEVEL_NAME_NULL);
        }
        if (readinessLevelDTO.getDescription() == null) {
            throw new CustomRuntimeException(CustomRuntimeException.READINESS_LEVEL_DESCRIPTION_NULL);
        }
        if (readinessLevelDTO.getLevels().size() != 9) {
            throw new CustomRuntimeException(CustomRuntimeException.READINESS_LEVEL_LEVELS_SIZE);
        }
        if (readinessLevelRepository.findByName(readinessLevelDTO.getName()) != null) {
            throw new CustomRuntimeException(CustomRuntimeException.READINESS_LEVEL_NAME_ALREADY_EXISTS);
        }
        readinessLevelDTO.setId(null);
        ReadinessLevel readinessLevelToSave = modelMapper.map(readinessLevelDTO, ReadinessLevel.class);
        ReadinessLevel savedReadinessLevel = readinessLevelRepository.save(readinessLevelToSave);
        ReadinessLevelDTO savedReadinessLevelDTO = modelMapper.map(savedReadinessLevel, ReadinessLevelDTO.class);
        return ResponseEntity.ok(savedReadinessLevelDTO);
    }

    public ResponseEntity<ReadinessLevelDTO> updateReadinessLevel(ReadinessLevelDTO readinessLevelDTO)
            throws CustomRuntimeException {
        // Check readiness level format
        if (readinessLevelDTO.getId() == null) {
            throw new CustomRuntimeException(CustomRuntimeException.READINESS_LEVEL_ID_NULL);
        }
        if (readinessLevelDTO.getName() == null) {
            throw new CustomRuntimeException(CustomRuntimeException.READINESS_LEVEL_NAME_NULL);
        }
        if (readinessLevelDTO.getDescription() == null) {
            throw new CustomRuntimeException(CustomRuntimeException.READINESS_LEVEL_DESCRIPTION_NULL);
        }
        if (readinessLevelDTO.getLevels().size() != 9) {
            throw new CustomRuntimeException(CustomRuntimeException.READINESS_LEVEL_LEVELS_SIZE);
        }
        // Check if the ID corresponds to an existing readiness level
        if (readinessLevelRepository.findById(readinessLevelDTO.getId()).orElse(null) == null) {
            throw new CustomRuntimeException(CustomRuntimeException.READINESS_LEVEL_NOT_FOUND);
        }

        // Check if the name is already used by another readiness level
        ReadinessLevel readinessLevelWithSameName = readinessLevelRepository.findByName(readinessLevelDTO.getName());
        if (readinessLevelWithSameName != null
                && !readinessLevelWithSameName.getId().equals(readinessLevelDTO.getId())) {
            throw new CustomRuntimeException(CustomRuntimeException.READINESS_LEVEL_NAME_ALREADY_EXISTS);
        }
        // Update the readiness level if all checks are passed
        ReadinessLevel readinessLevelToUpdate = modelMapper.map(readinessLevelDTO, ReadinessLevel.class);
        ReadinessLevel updatedReadinessLevel = readinessLevelRepository.save(readinessLevelToUpdate);
        ReadinessLevelDTO updatedReadinessLevelDTO = modelMapper.map(updatedReadinessLevel, ReadinessLevelDTO.class);
        return ResponseEntity.ok(updatedReadinessLevelDTO);
    }
}
