package fr.eseo.pfe.xrlonline.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.BusinessLineDTO;
import fr.eseo.pfe.xrlonline.service.BusinessLineService;
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

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.when;

@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class BusinessLineControllerTest {

    private MockMvc mockMvc;

    @Mock
    private BusinessLineService businessLineService;

    @InjectMocks
    private BusinessLineController businessLineController;

    private BusinessLineDTO businessLineDTO1;
    private BusinessLineDTO businessLineDTO2;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(businessLineController).build();

        businessLineDTO1 = new BusinessLineDTO();
        businessLineDTO1.setId("1");
        businessLineDTO1.setName("Test Business Line 1");

        businessLineDTO2 = new BusinessLineDTO();
        businessLineDTO2.setId("2");
        businessLineDTO2.setName("Test Business Line 2");
    }

    @AfterEach
    void tearDown() {
        reset(businessLineService);
    }

    @Test
    void testGetAllBusinessLine() throws Exception {
        when(businessLineService.getAllBusinessLine()).thenReturn(ResponseEntity.ok(Arrays.asList(businessLineDTO1, businessLineDTO2)));

        assertDoesNotThrow(() -> 
            mockMvc.perform(MockMvcRequestBuilders.get("/businessLines/get-all-businessLines")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").value("Test Business Line 1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].name").value("Test Business Line 2"))
        );
    }

    @Test
    void testGetAllBusinessLineNotFound() throws Exception {
        when(businessLineService.getAllBusinessLine()).thenThrow(new CustomRuntimeException(CustomRuntimeException.BUSINESS_LINE_LIST_EMPTY));

        assertDoesNotThrow(() -> 
            mockMvc.perform(MockMvcRequestBuilders.get("/businessLines/get-all-businessLines")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(MockMvcResultMatchers.status().isNoContent())
        );
    }

    @Test
    void testGetBusinessLineByIdBusinessLineExist() throws Exception {
        when(businessLineService.getBusinessLineById("1")).thenReturn(ResponseEntity.ok(businessLineDTO1));

        assertDoesNotThrow(() -> 
            mockMvc.perform(MockMvcRequestBuilders.get("/businessLines/get-businessLine-by-id")
                            .param("id", "1")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(MockMvcResultMatchers.status().isOk())
                    .andExpect(MockMvcResultMatchers.jsonPath("$.id").value("1"))
                    .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Test Business Line 1"))
        );
    }

    @Test
    void testGetBusinessLineByIdBusinessLineNotFound() throws Exception {
        when(businessLineService.getBusinessLineById("nonexistentId")).thenThrow(new CustomRuntimeException(CustomRuntimeException.BUSINESS_LINE_NOT_FOUND));

        assertDoesNotThrow(() -> 
            mockMvc.perform(MockMvcRequestBuilders.get("/businessLines/get-businessLine-by-id")
                            .param("id", "nonexistentId")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(MockMvcResultMatchers.status().isNotFound())
        );
    }

    @Test
    void testCreateBusinessLineNameNotExist() throws Exception {
        when(businessLineService.createBusinessLine(any(BusinessLineDTO.class))).thenReturn(ResponseEntity.ok(businessLineDTO1));

        assertDoesNotThrow(() -> 
            mockMvc.perform(MockMvcRequestBuilders.post("/businessLines/create-businessLine")
                            .content(asJsonString(businessLineDTO1))
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(MockMvcResultMatchers.status().isOk())
                    .andExpect(MockMvcResultMatchers.jsonPath("$.id").value("1"))
                    .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Test Business Line 1"))
        );
    }

    @Test
    void testCreateBusinessLineNameAlreadyExist() throws Exception {
        when(businessLineService.createBusinessLine(any(BusinessLineDTO.class))).thenThrow(new CustomRuntimeException(CustomRuntimeException.BUSINESS_LINE_NAME_ALREADY_EXISTS));

        assertDoesNotThrow(() -> 
            mockMvc.perform(MockMvcRequestBuilders.post("/businessLines/create-businessLine")
                            .content(asJsonString(new BusinessLineDTO()))
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(MockMvcResultMatchers.status().isConflict())
        );
    }

    @Test
    void testUpdateBusinessLineBusinessLineExist() throws Exception {
        when(businessLineService.updateBusinessLine(any(BusinessLineDTO.class))).thenReturn(ResponseEntity.ok(businessLineDTO1));

        assertDoesNotThrow(() -> 
            mockMvc.perform(MockMvcRequestBuilders.put("/businessLines/update-businessLine")
                            .content(asJsonString(businessLineDTO1))
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(MockMvcResultMatchers.status().isOk())
                    .andExpect(MockMvcResultMatchers.jsonPath("$.id").value("1"))
                    .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Test Business Line 1"))
        );
    }

    @Test
    void testUpdateBusinessLineBusinessLineNameAlreadyExist() throws Exception {
        when(businessLineService.updateBusinessLine(any(BusinessLineDTO.class))).thenThrow(new CustomRuntimeException(CustomRuntimeException.BUSINESS_LINE_NAME_ALREADY_EXISTS));

        assertDoesNotThrow(() -> 
            mockMvc.perform(MockMvcRequestBuilders.put("/businessLines/update-businessLine")
                            .content(asJsonString(new BusinessLineDTO()))
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(MockMvcResultMatchers.status().isConflict())
        );
    }

    @Test
    void testUpdateBusinessLineBusinessLineNotFound() throws Exception {
        when(businessLineService.updateBusinessLine(any(BusinessLineDTO.class))).thenThrow(new CustomRuntimeException(CustomRuntimeException.BUSINESS_LINE_NOT_FOUND));

        assertDoesNotThrow(() -> 
            mockMvc.perform(MockMvcRequestBuilders.put("/businessLines/update-businessLine")
                            .content(asJsonString(new BusinessLineDTO()))
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(MockMvcResultMatchers.status().isNotFound())
        );
    }

    @Test
    void testDeleteBusinessLineBusinessLineExist() throws Exception {
        when(businessLineService.deleteBusinessLine("1")).thenReturn(ResponseEntity.ok(businessLineDTO1));

        assertDoesNotThrow(() -> 
            mockMvc.perform(MockMvcRequestBuilders.delete("/businessLines/delete-businessLine")
                            .param("id", "1")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(MockMvcResultMatchers.status().isOk())
                    .andExpect(MockMvcResultMatchers.jsonPath("$.id").value("1"))
                    .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Test Business Line 1"))
        );
    }

    @Test
    void testDeleteBusinessLineBusinessLineNotFound() throws Exception {
        when(businessLineService.deleteBusinessLine("nonexistentId")).thenThrow(new CustomRuntimeException(CustomRuntimeException.BUSINESS_LINE_NOT_FOUND));

        assertDoesNotThrow(() -> 
            mockMvc.perform(MockMvcRequestBuilders.delete("/businessLines/delete-businessLine")
                            .param("id", "nonexistentId")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(MockMvcResultMatchers.status().isNotFound())
        );
    }

    // Méthode utilitaire pour convertir un objet en JSON
    private static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
