package fr.eseo.pfe.xrlonline.service;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.BusinessLineDTO;
import fr.eseo.pfe.xrlonline.model.dto.UserDTO;
import fr.eseo.pfe.xrlonline.model.entity.BusinessLine;
import fr.eseo.pfe.xrlonline.model.entity.User;
import fr.eseo.pfe.xrlonline.repository.BusinessLineRepository;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BusinessLineServiceTest {

    @InjectMocks
    private BusinessLineService businessLineService;

    @Mock
    private BusinessLineRepository businessLineRepository;

    @Mock
    private ModelMapper modelMapper;

    private BusinessLineDTO businessLineDTO;
    private BusinessLine businessLine;

    @BeforeEach
    public void setUp() {
        businessLineDTO = new BusinessLineDTO();
        businessLineDTO.setId("1");
        businessLineDTO.setName("TestBusinessLine");

        businessLine = new BusinessLine();
        businessLine.setId("1");
        businessLine.setName("TestBusinessLine");
    }

    @Test
    void testGetUserById_Found() throws CustomRuntimeException {
        when(businessLineRepository.findById("1")).thenReturn(Optional.of(businessLine));
        when(modelMapper.map(businessLine, BusinessLineDTO.class)).thenReturn(businessLineDTO);

        ResponseEntity<BusinessLineDTO> response = businessLineService.getBusinessLineById("1");

        assertEquals(ResponseEntity.ok(businessLineDTO), response, "Business Line found");
    }

    @Test
    void testGetBusinessLineById_NotFound() {
        when(businessLineRepository.findById("1")).thenReturn(Optional.empty());

        CustomRuntimeException customRuntimeException = assertThrowsExactly(CustomRuntimeException.class, () -> businessLineService.getBusinessLineById("1"), "Business Line not found");
        assertEquals(CustomRuntimeException.BUSINESS_LINE_NOT_FOUND, customRuntimeException.getMessage());
    }

    @Test
    void testGetBusinessLineByName_Found() throws CustomRuntimeException {
        when(businessLineRepository.findByName("TestBusinessLine")).thenReturn(businessLine);
        when(modelMapper.map(businessLine, BusinessLineDTO.class)).thenReturn(businessLineDTO);

        ResponseEntity<BusinessLineDTO> response = businessLineService.getBusinessLineByName("TestBusinessLine");

        assertEquals(ResponseEntity.ok(businessLineDTO), response, "Business Line found");
    }

    @Test
    void testGetBusinessLineByName_NotFound() {
        when(businessLineRepository.findByName("TestBusinessLine")).thenReturn(null);

        CustomRuntimeException customRuntimeException = assertThrowsExactly(CustomRuntimeException.class, () -> businessLineService.getBusinessLineByName("TestBusinessLine"), "Business Line not found");
        assertEquals(CustomRuntimeException.BUSINESS_LINE_NOT_FOUND, customRuntimeException.getMessage());
    }

    @Test
    void testGetAllBusinessLine_Found() throws CustomRuntimeException {
        List<BusinessLine> businessLines = new ArrayList<>();
        businessLines.add(businessLine);

        when(businessLineRepository.findAll()).thenReturn(businessLines);
        when(modelMapper.map(businessLine, BusinessLineDTO.class)).thenReturn(businessLineDTO);

        ResponseEntity<List<BusinessLineDTO>> response = businessLineService.getAllBusinessLine();

        assertEquals(ResponseEntity.ok(List.of(businessLineDTO)), response, "Business Lines found");
    }

    @Test
    void testGetAllBusinessLine_NotFound() {
        when(businessLineRepository.findAll()).thenReturn(new ArrayList<>());

        CustomRuntimeException customRuntimeException = assertThrowsExactly(CustomRuntimeException.class, () -> businessLineService.getAllBusinessLine(), "Business Lines empty");
        assertEquals(CustomRuntimeException.BUSINESS_LINE_LIST_EMPTY, customRuntimeException.getMessage());
    }

    @Test
    void testCreateBusinessLine_NameNotExist() throws CustomRuntimeException {
        when(businessLineRepository.findByName("TestBusinessLine")).thenReturn(null);
        when(modelMapper.map(businessLineDTO, BusinessLine.class)).thenReturn(businessLine);

        BusinessLine businessLineSaved = businessLine;

        // Verify that the createUser method returns the expected ResponseEntity
        when(businessLineRepository.save(businessLine)).thenReturn(businessLineSaved);
        when(modelMapper.map(businessLineSaved, BusinessLineDTO.class)).thenReturn(businessLineDTO);

        ResponseEntity<BusinessLineDTO> response = businessLineService.createBusinessLine(businessLineDTO);

        // Verify that the createUser method returns the expected ResponseEntity
        assertEquals(ResponseEntity.ok(businessLineDTO), response, "Business Line created");
    }


    @Test
    void testCreateBusinessLine_NameAlreadyExist() {
        when(businessLineRepository.findByName("TestBusinessLine")).thenReturn(businessLine);

        CustomRuntimeException customRuntimeException = assertThrowsExactly(CustomRuntimeException.class, () -> businessLineService.createBusinessLine(businessLineDTO), "Business Line already exists");
        assertEquals(CustomRuntimeException.BUSINESS_LINE_NAME_ALREADY_EXISTS, customRuntimeException.getMessage());
    }

    @Test
    void testCreateBusinessLine_NameNull() {
        businessLineDTO.setName(null);

        CustomRuntimeException customRuntimeException = assertThrowsExactly(CustomRuntimeException.class, () -> businessLineService.createBusinessLine(businessLineDTO), "Business Line name is null");
        assertEquals(CustomRuntimeException.BUSINESS_LINE_NAME_NULL, customRuntimeException.getMessage());
    }

    @Test
    void testUpdateBusinessLine_Found() throws CustomRuntimeException {
        when(businessLineRepository.findById("1")).thenReturn(Optional.of(businessLine));


        businessLineDTO.setName("updatedName");

        when(businessLineRepository.findByName("updatedName")).thenReturn(null);

        // Verify that the updateUser method returns the expected ResponseEntity
        when(businessLineRepository.save(businessLine)).thenReturn(businessLine);
        when(modelMapper.map(businessLine, BusinessLineDTO.class)).thenReturn(businessLineDTO);

        ResponseEntity<BusinessLineDTO> response = businessLineService.updateBusinessLine(businessLineDTO);

        assertEquals(ResponseEntity.ok(businessLineDTO), response, "Business Line updated");
    }

    @Test
    void testUpdateBusinessLine_FoundButNameAlreadyExist() {
        businessLineDTO.setName("updatedName");
        when(businessLineRepository.findById("1")).thenReturn(Optional.of(businessLine));
        BusinessLine businessLineAlreadyExist = new BusinessLine();
        when(businessLineRepository.findByName("updatedName")).thenReturn(businessLineAlreadyExist);

        CustomRuntimeException customRuntimeException = assertThrowsExactly(CustomRuntimeException.class, () -> businessLineService.updateBusinessLine(businessLineDTO), "Business Line name already exists");
        assertEquals(CustomRuntimeException.BUSINESS_LINE_NAME_ALREADY_EXISTS, customRuntimeException.getMessage());
    }

    @Test
    void testUpdateBusinessLine_NotFound() {
        when(businessLineRepository.findById("1")).thenReturn(Optional.empty());

        CustomRuntimeException customRuntimeException = assertThrowsExactly(CustomRuntimeException.class, () -> businessLineService.updateBusinessLine(businessLineDTO), "Business Line not found");
        assertEquals(CustomRuntimeException.BUSINESS_LINE_NOT_FOUND, customRuntimeException.getMessage());
    }

    @Test
    void testDeleteBusinessLine_Exist() throws CustomRuntimeException {
        when(businessLineRepository.findById("1")).thenReturn(Optional.of(businessLine));
        when(modelMapper.map(businessLine, BusinessLineDTO.class)).thenReturn(businessLineDTO);

        ResponseEntity<BusinessLineDTO> response = businessLineService.deleteBusinessLine("1");

        assertEquals(ResponseEntity.ok(businessLineDTO), response, "Business Line deleted");
        verify(businessLineRepository).delete(businessLine);
    }

    @Test
    void testDeleteBusinessLine_NotExist() {
        when(businessLineRepository.findById("1")).thenReturn(Optional.empty());

        CustomRuntimeException customRuntimeException = assertThrowsExactly(CustomRuntimeException.class, () -> businessLineService.deleteBusinessLine("1"), "Business Line not found");
        assertEquals(CustomRuntimeException.BUSINESS_LINE_NOT_FOUND, customRuntimeException.getMessage());
    }
}



