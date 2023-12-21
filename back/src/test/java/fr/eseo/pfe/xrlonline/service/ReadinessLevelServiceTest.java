package fr.eseo.pfe.xrlonline.service;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.ReadinessLevelDTO;
import fr.eseo.pfe.xrlonline.model.entity.ReadinessLevel;
import fr.eseo.pfe.xrlonline.repository.CustomRequestRepository;
import fr.eseo.pfe.xrlonline.repository.ReadinessLevelRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReadinessLevelServiceTest {

    @InjectMocks
    private ReadinessLevelService readinessLevelService;

    @Mock
    private ReadinessLevelRepository readinessLevelRepository;

    @Mock
    private CustomRequestRepository customRequestRepository;

    @Mock
    private ModelMapper modelMapper;

    private static ReadinessLevelDTO readinessLevelDTO;

    private static ReadinessLevel readinessLevel;

    @BeforeEach
    void setUp() {
        readinessLevelDTO = new ReadinessLevelDTO();
        readinessLevelDTO.setId("id");
        readinessLevelDTO.setName("name");
        readinessLevelDTO.setDescription("description");
        List<ReadinessLevelDTO.LevelDTO> levelsArray = new ArrayList<>(9);
        for (int i = 0; i < 9; i++) {
            ReadinessLevelDTO.LevelDTO levelDTO = new ReadinessLevelDTO.LevelDTO();
            levelDTO.setLongDescription(new ArrayList<>());
            levelDTO.setShortDescription("shortDescription");
            levelDTO.setLevel(i);
            levelsArray.add(levelDTO);
        }
        readinessLevelDTO.setLevels(levelsArray);

        readinessLevel = new ReadinessLevel();
        readinessLevel.setId("id");
        readinessLevel.setName("name");
        readinessLevel.setDescription("description");
        List<ReadinessLevel.Level> levelsArray2 = new ArrayList<>(9);
        for (int i = 0; i < 9; i++) {
            ReadinessLevel.Level level = new ReadinessLevel.Level();
            level.setLongDescription(new ArrayList<>());
            level.setShortDescription("shortDescription");
            level.setLevel(i);
            levelsArray2.add(level);
        }
        readinessLevel.setLevels(levelsArray2);
    }

    @Test
    void testGetReadinessLevelById_RLFound() throws CustomRuntimeException {
        when(readinessLevelRepository.findById("id")).thenReturn(Optional.of(new ReadinessLevel()));
        when(modelMapper.map(readinessLevelRepository.findById("id").orElse(null), ReadinessLevelDTO.class))
                .thenReturn(readinessLevelDTO);

        ResponseEntity<ReadinessLevelDTO> responseEntity = readinessLevelService.getReadinessLevelById("id");
        ReadinessLevelDTO responseBody = responseEntity.getBody();
        
        assertNotNull(responseBody);
        assertEquals(responseBody.getId(), readinessLevelDTO.getId());
        assertEquals(responseBody.getName(), readinessLevelDTO.getName());
        assertEquals(responseBody.getDescription(), readinessLevelDTO.getDescription());
        assertEquals(responseBody.getLevels(), readinessLevelDTO.getLevels());
    }

    @Test
    void testGetReadinessLevelById_RLNotFound() throws CustomRuntimeException {
        when(readinessLevelRepository.findById("id")).thenReturn(Optional.empty());

        try {
            readinessLevelService.getReadinessLevelById("id");
            fail("Expected CustomRuntimeException");
        } catch (CustomRuntimeException e) {
            assertEquals(CustomRuntimeException.READINESS_LEVEL_NOT_FOUND, e.getMessage());
        }
    }

    @Test
    void testGetAllReadinessLevel_RLFound() throws CustomRuntimeException {
        List<ReadinessLevelDTO> readinessLevelDTOList = new ArrayList<>();
        readinessLevelDTOList.add(readinessLevelDTO);
        when(readinessLevelRepository.findAll()).thenReturn(List.of(new ReadinessLevel()));
        when(modelMapper.map(readinessLevelRepository.findAll().get(0), ReadinessLevelDTO.class))
                .thenReturn(readinessLevelDTO);
        when(customRequestRepository.isReadinessLevelUsed(readinessLevelDTO.getId())).thenReturn(false);

        ResponseEntity<List<ReadinessLevelDTO>> responseEntity = readinessLevelService.getAllReadinessLevel();
        List<ReadinessLevelDTO> responseBody = responseEntity.getBody();

        assertNotNull(responseBody);
        assertEquals(responseBody.get(0).getId(), readinessLevelDTOList.get(0).getId());
        assertEquals(responseBody.get(0).getName(), readinessLevelDTOList.get(0).getName());
        assertEquals(responseBody.get(0).getDescription(), readinessLevelDTOList.get(0).getDescription());
        assertEquals(responseBody.get(0).getLevels(), readinessLevelDTOList.get(0).getLevels());
    }

    @Test
    void testGetAllReadinessLevel_RLNotFound() throws CustomRuntimeException {
        when(readinessLevelRepository.findAll()).thenReturn(List.of());

        try {
            readinessLevelService.getAllReadinessLevel();
            fail("Expected CustomRuntimeException");
        } catch (CustomRuntimeException e) {
            assertEquals(CustomRuntimeException.READINESS_LEVEL_LIST_EMPTY, e.getMessage());
        }
    }

    @Test
    void testCreateReadinessLevel_Success() throws CustomRuntimeException {
        when(readinessLevelRepository.findByName("name")).thenReturn(null);
        when(modelMapper.map(readinessLevelDTO, ReadinessLevel.class)).thenReturn(readinessLevel);
        when(readinessLevelRepository.save(readinessLevel)).thenReturn(readinessLevel);
        when(modelMapper.map(readinessLevel, ReadinessLevelDTO.class)).thenReturn(readinessLevelDTO);

        ResponseEntity<ReadinessLevelDTO> responseEntity = readinessLevelService.createReadinessLevel(readinessLevelDTO);
        ReadinessLevelDTO responseBody = responseEntity.getBody();

        assertNotNull(responseBody);
        assertEquals(responseBody.getId(), readinessLevelDTO.getId());
        assertEquals(responseBody.getName(), readinessLevelDTO.getName());
        assertEquals(responseBody.getDescription(), readinessLevelDTO.getDescription());
        assertEquals(responseBody.getLevels(), readinessLevelDTO.getLevels());
    }

    @Test
    void testCreateReadinessLevel_NameNull() throws CustomRuntimeException {
        readinessLevelDTO.setName(null);
        try {
            readinessLevelService.createReadinessLevel(readinessLevelDTO);
            fail("Expected CustomRuntimeException");
        } catch (CustomRuntimeException e) {
            assertEquals(CustomRuntimeException.READINESS_LEVEL_NAME_NULL, e.getMessage());
        }
    }

    @Test
    void testCreateReadinessLevel_DescriptionNull() throws CustomRuntimeException {
        readinessLevelDTO.setDescription(null);
        try {
            readinessLevelService.createReadinessLevel(readinessLevelDTO);
            fail("Expected CustomRuntimeException");
        } catch (CustomRuntimeException e) {
            assertEquals(CustomRuntimeException.READINESS_LEVEL_DESCRIPTION_NULL, e.getMessage());
        }
    }

    @Test
    void testCreateReadinessLevel_LevelsSize() throws CustomRuntimeException {
        readinessLevelDTO.getLevels().remove(0);
        try {
            readinessLevelService.createReadinessLevel(readinessLevelDTO);
            fail("Expected CustomRuntimeException");
        } catch (CustomRuntimeException e) {
            assertEquals(CustomRuntimeException.READINESS_LEVEL_LEVELS_SIZE, e.getMessage());
        }
    }

    @Test
    void testCreateReadinessLevel_NameAlreadyExists() throws CustomRuntimeException {
        when(readinessLevelRepository.findByName("name")).thenReturn(new ReadinessLevel());
        try {
            readinessLevelService.createReadinessLevel(readinessLevelDTO);
            fail("Expected CustomRuntimeException");
        } catch (CustomRuntimeException e) {
            assertEquals(CustomRuntimeException.READINESS_LEVEL_NAME_ALREADY_EXISTS, e.getMessage());
        }
    }

    @Test
    void testUpdateReadinessLevel_Success() throws CustomRuntimeException {
        when(readinessLevelRepository.findById("id")).thenReturn(Optional.of(new ReadinessLevel()));
        when(modelMapper.map(readinessLevelDTO, ReadinessLevel.class)).thenReturn(readinessLevel);
        when(readinessLevelRepository.save(readinessLevel)).thenReturn(readinessLevel);
        when(modelMapper.map(readinessLevel, ReadinessLevelDTO.class)).thenReturn(readinessLevelDTO);

        ResponseEntity<ReadinessLevelDTO> responseEntity = readinessLevelService.updateReadinessLevel(readinessLevelDTO);
        ReadinessLevelDTO responseBody = responseEntity.getBody();

        assertNotNull(responseBody);
        assertEquals(responseBody.getId(), readinessLevelDTO.getId());
        assertEquals(responseBody.getName(), readinessLevelDTO.getName());
        assertEquals(responseBody.getDescription(), readinessLevelDTO.getDescription());
        assertEquals(responseBody.getLevels(), readinessLevelDTO.getLevels());
    }

    @Test
    void testUpdateReadinessLevel_IdNull() throws CustomRuntimeException {
        readinessLevelDTO.setId(null);
        try {
            readinessLevelService.updateReadinessLevel(readinessLevelDTO);
            fail("Expected CustomRuntimeException");
        } catch (CustomRuntimeException e) {
            assertEquals(CustomRuntimeException.READINESS_LEVEL_ID_NULL, e.getMessage());
        }
    }

    @Test
    void testUpdateReadinessLevel_NameNull() throws CustomRuntimeException {
        readinessLevelDTO.setName(null);
        try {
            readinessLevelService.updateReadinessLevel(readinessLevelDTO);
            fail("Expected CustomRuntimeException");
        } catch (CustomRuntimeException e) {
            assertEquals(CustomRuntimeException.READINESS_LEVEL_NAME_NULL, e.getMessage());
        }
    }

    @Test
    void testUpdateReadinessLevel_DescriptionNull() throws CustomRuntimeException {
        readinessLevelDTO.setDescription(null);
        try {
            readinessLevelService.updateReadinessLevel(readinessLevelDTO);
            fail("Expected CustomRuntimeException");
        } catch (CustomRuntimeException e) {
            assertEquals(CustomRuntimeException.READINESS_LEVEL_DESCRIPTION_NULL, e.getMessage());
        }
    }

    @Test
    void testUpdateReadinessLevel_LevelsSize() throws CustomRuntimeException {
        readinessLevelDTO.getLevels().remove(0);
        try {
            readinessLevelService.updateReadinessLevel(readinessLevelDTO);
            fail("Expected CustomRuntimeException");
        } catch (CustomRuntimeException e) {
            assertEquals(CustomRuntimeException.READINESS_LEVEL_LEVELS_SIZE, e.getMessage());
        }
    }

    @Test
    void testUpdateReadinessLevel_RLNotFound() throws CustomRuntimeException {
        when(readinessLevelRepository.findById("id")).thenReturn(Optional.empty());
        try {
            readinessLevelService.updateReadinessLevel(readinessLevelDTO);
            fail("Expected CustomRuntimeException");
        } catch (CustomRuntimeException e) {
            assertEquals(CustomRuntimeException.READINESS_LEVEL_NOT_FOUND, e.getMessage());
        }
    }

    @Test
    void testUpdateReadinessLevel_NameAlreadyExists() throws CustomRuntimeException {
        readinessLevel.setId("id2");
        when(readinessLevelRepository.findById("id")).thenReturn(Optional.of(readinessLevel));
        when(readinessLevelRepository.findByName("name")).thenReturn(readinessLevel);
        try {
            readinessLevelService.updateReadinessLevel(readinessLevelDTO);
            fail("Expected CustomRuntimeException");
        } catch (CustomRuntimeException e) {
            assertEquals(CustomRuntimeException.READINESS_LEVEL_NAME_ALREADY_EXISTS, e.getMessage());
        }
    }

    @Test
    void testDeleteReadinessLevel_Success() throws CustomRuntimeException {
        when(readinessLevelRepository.findById("id")).thenReturn(Optional.of(new ReadinessLevel()));
        when(customRequestRepository.isReadinessLevelUsed("id")).thenReturn(false);
        ResponseEntity<ReadinessLevelDTO> responseEntity = readinessLevelService.deleteReadinessLevel("id");
        assertEquals(responseEntity.getStatusCode(), ResponseEntity.ok().build().getStatusCode());
    }

    @Test
    void testDeleteReadinessLevel_RLNotFound() throws CustomRuntimeException {
        when(readinessLevelRepository.findById("id")).thenReturn(Optional.empty());
        try {
            readinessLevelService.deleteReadinessLevel("id");
            fail("Expected CustomRuntimeException");
        } catch (CustomRuntimeException e) {
            assertEquals(CustomRuntimeException.READINESS_LEVEL_NOT_FOUND, e.getMessage());
        }
    }

    @Test
    void testDeleteReadinessLevel_RLUsed() throws CustomRuntimeException {
        when(readinessLevelRepository.findById("id")).thenReturn(Optional.of(new ReadinessLevel()));
        when(customRequestRepository.isReadinessLevelUsed("id")).thenReturn(true);
        try {
            readinessLevelService.deleteReadinessLevel("id");
            fail("Expected CustomRuntimeException");
        } catch (CustomRuntimeException e) {
            assertEquals(CustomRuntimeException.READINESS_LEVEL_USED, e.getMessage());
        }
    }

}