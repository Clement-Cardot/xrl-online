package fr.eseo.pfe.xrlonline.controller;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.ProjectDTO;
import fr.eseo.pfe.xrlonline.model.dto.ReportProjectDTO;
import fr.eseo.pfe.xrlonline.service.ProjectService;
import fr.eseo.pfe.xrlonline.service.reports.PdfReportService;
import fr.eseo.pfe.xrlonline.service.reports.PresentationReportService;
import fr.eseo.pfe.xrlonline.service.reports.WordReportService;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class FilesControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ProjectService projectService;

    @Mock
    private PdfReportService pdfReportService;

    @Mock
    private WordReportService wordReportService;

    @Mock
    private PresentationReportService presentationReportService;

    @InjectMocks
    private FilesController filesController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(filesController).build();
    }

    @AfterEach
    void tearDown() {
        reset(projectService);
        reset(pdfReportService);
        reset(wordReportService);
        reset(presentationReportService);
    }

    @Test
    void testGetReportPDF_Success() throws CustomRuntimeException {
        String id = "1";
        ReportProjectDTO reportProjectDTO = new ReportProjectDTO();
        ProjectDTO project = new ProjectDTO();
        project.setName("testing");
        byte[] body = new byte[10];

        when(projectService.getProjectById(id)).thenReturn(project);
        when(pdfReportService.createPDF(project, reportProjectDTO)).thenReturn(body);

        assertDoesNotThrow(() ->
            mockMvc.perform(MockMvcRequestBuilders.post("/report/" + id + "/pdf")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(reportProjectDTO)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_PDF))
                .andExpect(MockMvcResultMatchers.header().string(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + project.getName() + "-report.pdf"))
                .andExpect(MockMvcResultMatchers.content().bytes(body))
        );
    }

    @Test
    void testGetReportPDF_Error() throws CustomRuntimeException {
        String id = "1";
        ReportProjectDTO reportProjectDTO = new ReportProjectDTO();
        ProjectDTO project = new ProjectDTO();

        when(projectService.getProjectById(id)).thenReturn(project);
        when(pdfReportService.createPDF(project, reportProjectDTO)).thenThrow(new CustomRuntimeException(CustomRuntimeException.INTERNAL_SERVER_ERROR));

        assertDoesNotThrow(() ->
            mockMvc.perform(MockMvcRequestBuilders.post("/report/" + id + "/pdf")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(reportProjectDTO)))
                .andExpect(MockMvcResultMatchers.status().isInternalServerError())
        );
    }

    @Test
    void testGetReportPDF_UnknownError() throws CustomRuntimeException {
        String id = "1";
        ReportProjectDTO reportProjectDTO = new ReportProjectDTO();
        ProjectDTO project = new ProjectDTO();

        when(projectService.getProjectById(id)).thenReturn(project);
        when(pdfReportService.createPDF(project, reportProjectDTO)).thenThrow(new CustomRuntimeException(CustomRuntimeException.INTERNAL_SERVER_ERROR));

        assertDoesNotThrow(() ->
            mockMvc.perform(MockMvcRequestBuilders.post("/report/" + id + "/pdf")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(reportProjectDTO)))
                .andExpect(MockMvcResultMatchers.status().isInternalServerError())
        );
    }

    @Test
    void testGetReportWord_Success() throws CustomRuntimeException {
        String id = "1";
        ReportProjectDTO reportProjectDTO = new ReportProjectDTO();
        ProjectDTO project = new ProjectDTO();
        byte[] body = new byte[10];

        when(projectService.getProjectById(id)).thenReturn(project);
        when(wordReportService.createWord(project, reportProjectDTO)).thenReturn(body);

        assertDoesNotThrow(() ->
            mockMvc.perform(MockMvcRequestBuilders.post("/report/" + id + "/word")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(reportProjectDTO)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(new MediaType("application", "vnd.openxmlformats-officedocument.wordprocessingml.document")))
                .andExpect(MockMvcResultMatchers.header().string(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + project.getName() + "-report-" + java.time.LocalDate.now().toString() + ".docx"))
                .andExpect(MockMvcResultMatchers.content().bytes(body))
        );
    }

    @Test
    void testGetReportWord_Error() throws CustomRuntimeException {
        String id = "1";
        ReportProjectDTO reportProjectDTO = new ReportProjectDTO();
        ProjectDTO project = new ProjectDTO();

        when(projectService.getProjectById(id)).thenReturn(project);
        when(wordReportService.createWord(project, reportProjectDTO)).thenThrow(new CustomRuntimeException(CustomRuntimeException.INTERNAL_SERVER_ERROR));

        assertDoesNotThrow(() ->
            mockMvc.perform(MockMvcRequestBuilders.post("/report/" + id + "/word")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(reportProjectDTO)))
                .andExpect(MockMvcResultMatchers.status().isInternalServerError())
        );
    }

    @Test
    void testGetReportPPTX_Success() throws CustomRuntimeException {
        String id = "1";
        ReportProjectDTO reportProjectDTO = new ReportProjectDTO();
        ProjectDTO project = new ProjectDTO();
        byte[] body = new byte[10];

        when(projectService.getProjectById(id)).thenReturn(project);
        when(presentationReportService.createPPTX(project, reportProjectDTO)).thenReturn(body);

        assertDoesNotThrow(() ->
            mockMvc.perform(MockMvcRequestBuilders.post("/report/" + id + "/pptx")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(reportProjectDTO)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(new MediaType("application", "vnd.openxmlformats-officedocument.presentationml.presentation")))
                .andExpect(MockMvcResultMatchers.header().string(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + project.getName() + "-report-" + java.time.LocalDate.now().toString() + ".pptx"))
                .andExpect(MockMvcResultMatchers.content().bytes(body))
        );
    }

    @Test
    void testGetReportPPTX_Error() throws CustomRuntimeException {
        String id = "1";
        ReportProjectDTO reportProjectDTO = new ReportProjectDTO();
        ProjectDTO project = new ProjectDTO();

        when(projectService.getProjectById(id)).thenReturn(project);
        when(presentationReportService.createPPTX(project, reportProjectDTO)).thenThrow(new CustomRuntimeException(CustomRuntimeException.INTERNAL_SERVER_ERROR));

        assertDoesNotThrow(() ->
            mockMvc.perform(MockMvcRequestBuilders.post("/report/" + id + "/pptx")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(reportProjectDTO)))
                .andExpect(MockMvcResultMatchers.status().isInternalServerError())
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