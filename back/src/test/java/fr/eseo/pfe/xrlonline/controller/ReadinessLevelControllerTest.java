package fr.eseo.pfe.xrlonline.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.ReadinessLevelDTO;
import fr.eseo.pfe.xrlonline.service.ReadinessLevelService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.when;

@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class ReadinessLevelControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ReadinessLevelService readinessLevelService;

    @InjectMocks
    private ReadinessLevelController readinessLevelController;

    private ReadinessLevelDTO readinessLevelDTO;

    private ReadinessLevelDTO badReadinessLevelDTO;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(readinessLevelController).build();

        readinessLevelDTO = new ReadinessLevelDTO();
        readinessLevelDTO.setName("testReadinessLevel");
        readinessLevelDTO.setDescription("testDescription");
        readinessLevelDTO.setLevels(new ArrayList<>());

        badReadinessLevelDTO = new ReadinessLevelDTO();
        badReadinessLevelDTO.setName("badTestReadinessLevel");
        badReadinessLevelDTO.setDescription("badTestDescription");
        badReadinessLevelDTO.setLevels(new ArrayList<>());
    }

    @AfterEach
    public void tearDown() {
        reset(readinessLevelService);
    }

    @Test
    void testGetAllReadinessLevel() throws Exception {
        List<ReadinessLevelDTO> readinessLevelDTOList = new ArrayList<>();
        readinessLevelDTOList.add(readinessLevelDTO);
        when(readinessLevelService.getAllReadinessLevel()).thenReturn(ResponseEntity.ok(readinessLevelDTOList));

        mockMvc.perform(MockMvcRequestBuilders.get("/readiness-levels/get-all-readiness-levels"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content()
                        .json(new ObjectMapper().writeValueAsString(readinessLevelDTOList)));
    }

    @Test
    void testGetAllReadinessLevel_Error() throws Exception {
        List<ReadinessLevelDTO> readinessLevelDTOList = new ArrayList<>();
        readinessLevelDTOList.add(readinessLevelDTO);
        when(readinessLevelService.getAllReadinessLevel()).thenThrow(new CustomRuntimeException(CustomRuntimeException.INTERNAL_SERVER_ERROR));

        mockMvc.perform(MockMvcRequestBuilders.get("/readiness-levels/get-all-readiness-levels"))
                .andExpect(MockMvcResultMatchers.status().isInternalServerError());
    }

    @Test
    void testGetReadinessLevelById_RLFound() throws Exception {
        when(readinessLevelService.getReadinessLevelById("id")).thenReturn(ResponseEntity.ok(readinessLevelDTO));

        mockMvc.perform(MockMvcRequestBuilders.get("/readiness-levels/get-readiness-level-by-id?id=id"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(
                        MockMvcResultMatchers.content().json(new ObjectMapper().writeValueAsString(readinessLevelDTO)));
    }

    @Test
    void testGetReadinessLevelById_RLNotFound() throws Exception {
        when(readinessLevelService.getReadinessLevelById("id"))
                .thenThrow(new CustomRuntimeException(CustomRuntimeException.READINESS_LEVEL_NOT_FOUND));

        mockMvc.perform(MockMvcRequestBuilders.get("/readiness-levels/get-readiness-level-by-id?id=id"))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    void testCreateReadinessLevel_RLCreated() throws Exception {
        when(readinessLevelService.createReadinessLevel(readinessLevelDTO))
                .thenReturn(ResponseEntity.ok(readinessLevelDTO));

        mockMvc.perform(MockMvcRequestBuilders.post("/readiness-levels/create-readiness-level")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(readinessLevelDTO)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(
                        MockMvcResultMatchers.content().json(new ObjectMapper().writeValueAsString(readinessLevelDTO)));
    }

    @Test
    void testCreateReadinessLevel_RLAlreadyExists() throws Exception {
        when(readinessLevelService.createReadinessLevel(badReadinessLevelDTO))
                .thenThrow(new CustomRuntimeException(CustomRuntimeException.READINESS_LEVEL_NAME_ALREADY_EXISTS));

        mockMvc.perform(MockMvcRequestBuilders.post("/readiness-levels/create-readiness-level")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(badReadinessLevelDTO)))
                .andExpect(MockMvcResultMatchers.status().isConflict());
    }

    @Test
    void testCreateReadinessLevel_RLNameNull() throws Exception {
        when(readinessLevelService.createReadinessLevel(badReadinessLevelDTO))
                .thenThrow(new CustomRuntimeException(CustomRuntimeException.READINESS_LEVEL_NAME_NULL));

        mockMvc.perform(MockMvcRequestBuilders.post("/readiness-levels/create-readiness-level")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(badReadinessLevelDTO)))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    void testCreateReadinessLevel_RLDescriptionNull() throws Exception {
        when(readinessLevelService.createReadinessLevel(badReadinessLevelDTO))
                .thenThrow(new CustomRuntimeException(CustomRuntimeException.READINESS_LEVEL_DESCRIPTION_NULL));

        mockMvc.perform(MockMvcRequestBuilders.post("/readiness-levels/create-readiness-level")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(badReadinessLevelDTO)))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    void testCreateReadinessLevel_RLLevelsSize() throws Exception {
        when(readinessLevelService.createReadinessLevel(badReadinessLevelDTO))
                .thenThrow(new CustomRuntimeException(CustomRuntimeException.READINESS_LEVEL_LEVELS_SIZE));

        mockMvc.perform(MockMvcRequestBuilders.post("/readiness-levels/create-readiness-level")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(badReadinessLevelDTO)))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    void testUpdateReadinessLevel_RLUpdated() throws Exception {
        when(readinessLevelService.updateReadinessLevel(readinessLevelDTO))
                .thenReturn(ResponseEntity.ok(readinessLevelDTO));

        mockMvc.perform(MockMvcRequestBuilders.put("/readiness-levels/update-readiness-level")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(readinessLevelDTO)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(
                        MockMvcResultMatchers.content().json(new ObjectMapper().writeValueAsString(readinessLevelDTO)));
    }

    @Test
    void testUpdateReadinessLevel_RLNotFound() throws Exception {
        when(readinessLevelService.updateReadinessLevel(badReadinessLevelDTO))
                .thenThrow(new CustomRuntimeException(CustomRuntimeException.READINESS_LEVEL_NOT_FOUND));

        mockMvc.perform(MockMvcRequestBuilders.put("/readiness-levels/update-readiness-level")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(badReadinessLevelDTO)))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    void testUpdateReadinessLevel_RLNameNull() throws Exception {
        when(readinessLevelService.updateReadinessLevel(badReadinessLevelDTO))
                .thenThrow(new CustomRuntimeException(CustomRuntimeException.READINESS_LEVEL_NAME_NULL));

        mockMvc.perform(MockMvcRequestBuilders.put("/readiness-levels/update-readiness-level")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(badReadinessLevelDTO)))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    void testUpdateReadinessLevel_RLDescriptionNull() throws Exception {
        when(readinessLevelService.updateReadinessLevel(badReadinessLevelDTO))
                .thenThrow(new CustomRuntimeException(CustomRuntimeException.READINESS_LEVEL_DESCRIPTION_NULL));

        mockMvc.perform(MockMvcRequestBuilders.put("/readiness-levels/update-readiness-level")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(badReadinessLevelDTO)))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    void testUpdateReadinessLevel_RLLevelsSize() throws Exception {
        when(readinessLevelService.updateReadinessLevel(badReadinessLevelDTO))
                .thenThrow(new CustomRuntimeException(CustomRuntimeException.READINESS_LEVEL_LEVELS_SIZE));

        mockMvc.perform(MockMvcRequestBuilders.put("/readiness-levels/update-readiness-level")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(badReadinessLevelDTO)))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    void testDeleteReadinessLevel_RLDeleted() throws Exception {
        when(readinessLevelService.deleteReadinessLevel("id")).thenReturn(ResponseEntity.ok(readinessLevelDTO));

        mockMvc.perform(MockMvcRequestBuilders.delete("/readiness-levels/delete-readiness-level?id=id"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(
                        MockMvcResultMatchers.content().json(new ObjectMapper().writeValueAsString(readinessLevelDTO)));
    }

    @Test
    void testDeleteReadinessLevel_RLNotFound() throws Exception {
        when(readinessLevelService.deleteReadinessLevel("id"))
                .thenThrow(new CustomRuntimeException(CustomRuntimeException.READINESS_LEVEL_NOT_FOUND));

        mockMvc.perform(MockMvcRequestBuilders.delete("/readiness-levels/delete-readiness-level?id=id"))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    void testDeleteReadinessLevel_IsUsed() throws Exception {
        when(readinessLevelService.deleteReadinessLevel("id"))
                .thenThrow(new CustomRuntimeException(CustomRuntimeException.READINESS_LEVEL_USED));

        mockMvc.perform(MockMvcRequestBuilders.delete("/readiness-levels/delete-readiness-level?id=id"))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized());
    }

}