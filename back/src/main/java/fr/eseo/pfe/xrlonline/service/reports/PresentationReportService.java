package fr.eseo.pfe.xrlonline.service.reports;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.poi.sl.usermodel.PictureData.PictureType;
import org.apache.poi.sl.usermodel.TableCell.BorderEdge;
import org.apache.poi.sl.usermodel.TextParagraph.TextAlign;
import org.apache.poi.util.IOUtils;

import java.awt.Color;
import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xslf.usermodel.XSLFPictureData;
import org.apache.poi.xslf.usermodel.XSLFPictureShape;
import org.apache.poi.xslf.usermodel.XSLFSlide;
import org.apache.poi.xslf.usermodel.XSLFTable;
import org.apache.poi.xslf.usermodel.XSLFTableCell;
import org.apache.poi.xslf.usermodel.XSLFTableRow;
import org.apache.poi.xslf.usermodel.XSLFTextParagraph;
import org.apache.poi.xslf.usermodel.XSLFTextRun;
import org.apache.poi.xslf.usermodel.XSLFTextShape;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.AssessmentDTO;
import fr.eseo.pfe.xrlonline.model.dto.ProjectDTO;
import fr.eseo.pfe.xrlonline.model.dto.ReportProjectDTO;
import fr.eseo.pfe.xrlonline.model.dto.UserDTO;
import fr.eseo.pfe.xrlonline.model.entity.Assessment;
import fr.eseo.pfe.xrlonline.model.entity.Project;
import fr.eseo.pfe.xrlonline.model.entity.ReadinessLevel;

@Service
public class PresentationReportService {

    private ModelMapper modelMapper;

    private ReportTranslationService reportTranslationService;

    private static final String DATE_FORMAT = "dd/MM/yyyy";
    private static final String FONT_HELVETICA = "Helvetica";

    public PresentationReportService(ModelMapper modelMapper, ReportTranslationService reportTranslationService) {
        this.modelMapper = modelMapper;
        this.reportTranslationService = reportTranslationService;
    }

    public byte[] createPPTX(ProjectDTO projectDTO, ReportProjectDTO reportProjectDTO) throws CustomRuntimeException {        
        XMLSlideShow document = new XMLSlideShow();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try {
            // Write project information into document
            this.writeFile(document, projectDTO, reportProjectDTO);
            document.write(baos);

        } catch (IOException e) {
            throw new CustomRuntimeException("Error while creating word document");
        }

        return baos.toByteArray();
    }

    private void writeFile(XMLSlideShow document, ProjectDTO projectDTO, ReportProjectDTO reportProjectDTO) throws CustomRuntimeException {
        Map<String, String> i18n = reportTranslationService.getTranslations(reportProjectDTO.getLang());

        Project project = modelMapper.map(projectDTO, Project.class);

        try {
            firstSlide(document, projectDTO, reportProjectDTO, i18n);
            secondSlide(document, projectDTO, i18n);
            teamSlide(document, projectDTO, i18n);

            rlSlide(document, project, reportProjectDTO, i18n);

            lastSlide(document, reportProjectDTO, i18n);


        } catch (IOException e) {
            throw new CustomRuntimeException(CustomRuntimeException.INTERNAL_SERVER_ERROR, e);
        }
    }

    private void firstSlide(XMLSlideShow document, ProjectDTO projectDTO, ReportProjectDTO reportProjectDTO, Map<String, ?> i18n) {
        XSLFSlide slide = document.createSlide();
        this.addTitle(slide, projectDTO.getName());
        this.addTwoTexts(slide, i18n.get("team") + ": " + projectDTO.getTeam().getName(), i18n.get("businessLine") + ": " + projectDTO.getBusinessLine().getName());
        this.addImage(document, slide, reportProjectDTO.getLastXrlGraphDecoded());
        this.addFooter(slide, i18n);
    }

    private void secondSlide(XMLSlideShow document, ProjectDTO projectDTO, Map<String, ?> i18n){
        XSLFSlide slide = document.createSlide();
        this.addTitle(slide, projectDTO.getName());
        SimpleDateFormat dateFormat = new SimpleDateFormat(DATE_FORMAT);
        String startDate = i18n.get("startDate") + ": " + dateFormat.format(projectDTO.getInitialAssessment().getDate());
        Date endDate = projectDTO.getLastAssessment().getTag() == AssessmentDTO.TagDTO.FINAL ? projectDTO.getLastAssessment().getDate() : null;
        String endDateString = endDate == null ? "" : i18n.get("endDate") + ": " + dateFormat.format(endDate);
        this.addStartEndDates(slide, startDate, endDateString);
        this.addProjectDescription(slide, projectDTO.getDescription());
    }

    private void teamSlide(XMLSlideShow document, ProjectDTO projectDTO, Map<String, ?> i18n){
        XSLFSlide slide = document.createSlide();
        this.addTitle(slide, (String) i18n.get("teamMembers"));
        this.addMembers(slide, projectDTO.getTeam().getMembers());
    }

    private void rlSlide(XMLSlideShow document, Project project, ReportProjectDTO reportProjectDTO, Map<String, ?> i18n) throws IOException {
        for (Assessment.ReadinessLevelRank readinessLevelRank : project.getLastAssessment().getReadinessLevelRanks()) {
            addRLPage(document, readinessLevelRank, reportProjectDTO.getLinearGraphDecoded(readinessLevelRank.getReadinessLevel().getName()), i18n);
        }
    }

    private void lastSlide(XMLSlideShow document, ReportProjectDTO reportProjectDTO, Map<String, ?> i18n){
        XSLFSlide slideCompareWithInitialGraph = document.createSlide();
        this.addTitle(slideCompareWithInitialGraph, (String) i18n.get("compareWithInitialGraph"));
        // Ajouter une forme d'image à la diapositive
        XSLFPictureData imgDataslideCompareWithInitialGraph = document.addPicture(reportProjectDTO.getCompareWithInitialGraphDecoded(), PictureType.PNG);
        XSLFPictureShape pictureslideCompareWithInitialGraph = slideCompareWithInitialGraph.createPicture(imgDataslideCompareWithInitialGraph);
        // Définir la taille et la position de l'image
        int imgWidth = 720;
        int imgHeightCompareWithInitialGraph = (int)(imgWidth * pictureslideCompareWithInitialGraph.getPictureData().getImageDimension().getHeight() / pictureslideCompareWithInitialGraph.getPictureData().getImageDimension().getWidth());
        pictureslideCompareWithInitialGraph.setAnchor(new java.awt.Rectangle(-80, 120, imgWidth, imgHeightCompareWithInitialGraph));

        XSLFSlide slideCompareTwoLastGraphs = document.createSlide();
        this.addTitle(slideCompareTwoLastGraphs, (String) i18n.get("compareTwoLastGraphs"));
        // Ajouter une forme d'image à la diapositive
        XSLFPictureData imgDataCompareTwoLastGraphs = document.addPicture(reportProjectDTO.getCompareTwoLastGraphsDecoded(), PictureType.PNG);
        XSLFPictureShape pictureCompareTwoLastGraphs = slideCompareTwoLastGraphs.createPicture(imgDataCompareTwoLastGraphs);
        // Définir la taille et la position de l'image
        int imgHeightCompareTwoLastGraphs = (int)(imgWidth * pictureCompareTwoLastGraphs.getPictureData().getImageDimension().getHeight() / pictureCompareTwoLastGraphs.getPictureData().getImageDimension().getWidth());
        pictureCompareTwoLastGraphs.setAnchor(new java.awt.Rectangle(-80, 120, imgWidth, imgHeightCompareTwoLastGraphs));

        XSLFSlide slideCompleteLinearGraph = document.createSlide();
        this.addTitle(slideCompleteLinearGraph, (String) i18n.get("completeLinearGraph"));
        // Ajouter une forme d'image à la diapositive
        XSLFPictureData imgDataCompleteLinearGraph = document.addPicture(reportProjectDTO.getCompleteLinearGraphDecoded(), PictureType.PNG);
        XSLFPictureShape pictureCompleteLinearGraph = slideCompleteLinearGraph.createPicture(imgDataCompleteLinearGraph);
        // Définir la taille et la position de l'image
        int imgHeightCompleteLinearGraph = (int)(imgWidth * pictureCompleteLinearGraph.getPictureData().getImageDimension().getHeight() / pictureCompleteLinearGraph.getPictureData().getImageDimension().getWidth());
        pictureCompleteLinearGraph.setAnchor(new java.awt.Rectangle(0, 120, imgWidth, imgHeightCompleteLinearGraph));
    }

    private void addTitle(XSLFSlide slide, String title) {
        // Ajouter une forme de texte à la diapositive
        XSLFTextShape titleShape = slide.createTextBox();

        // Définir le texte et le style de la forme de texte
        XSLFTextParagraph titleParagraph = titleShape.addNewTextParagraph();
        XSLFTextRun titleRun = titleParagraph.addNewTextRun();
        titleRun.setText(title);
        titleRun.setFontSize(32.0);
        titleRun.setBold(true);
        titleRun.setFontColor(Color.BLACK);
        titleRun.setFontFamily(FONT_HELVETICA);

        // Centrer le texte
        titleParagraph.setTextAlign(TextAlign.CENTER);

        // Positionner la forme de texte
        titleShape.setAnchor(new java.awt.Rectangle(0, 0, 720, 60));
    }

    private void addTwoTexts(XSLFSlide slide, String leftText, String rightText) {
        // Team box
        XSLFTextShape teamShape = slide.createTextBox();

        XSLFTextParagraph teamParagraph = teamShape.addNewTextParagraph();
        XSLFTextRun teamRun = teamParagraph.addNewTextRun();
        teamRun.setText(leftText);
        teamRun.setFontSize(14.0);
        teamRun.setFontColor(Color.BLACK);
        teamRun.setFontFamily(FONT_HELVETICA);

        teamParagraph.setTextAlign(TextAlign.LEFT);

        teamShape.setAnchor(new java.awt.Rectangle(20, 50, 200, 60));

        // Business line box
        XSLFTextShape businessShape = slide.createTextBox();

        XSLFTextParagraph businessParagraph = businessShape.addNewTextParagraph();
        XSLFTextRun businessRun = businessParagraph.addNewTextRun();
        businessRun.setText(rightText);
        businessRun.setFontSize(14.0);
        businessRun.setFontColor(Color.BLACK);
        businessRun.setFontFamily(FONT_HELVETICA);

        businessParagraph.setTextAlign(TextAlign.RIGHT);

        businessShape.setAnchor(new java.awt.Rectangle(480, 50, 220, 60));
    }

    private void addImage(XMLSlideShow document, XSLFSlide slide, byte[] img) {
        // Ajouter une forme d'image à la diapositive
        XSLFPictureData imgData = document.addPicture(img, PictureType.PNG);
        XSLFPictureShape picture = slide.createPicture(imgData);

        // Définir la taille et la position de l'image
        int imgHeight = 380;
        int imgWidth = (int)(imgHeight * picture.getPictureData().getImageDimension().getWidth() / picture.getPictureData().getImageDimension().getHeight());
        picture.setAnchor(new java.awt.Rectangle(-45, 100, imgWidth, imgHeight));
    }

    private void addFooter(XSLFSlide slide, Map<String, ?> i18n) {
        XSLFTextShape generated = slide.createTextBox();

        XSLFTextParagraph generatedParagraph = generated.addNewTextParagraph();
        XSLFTextRun generatedRun = generatedParagraph.addNewTextRun();
        SimpleDateFormat dateFormat = new SimpleDateFormat(DATE_FORMAT);
        generatedRun.setText(i18n.get("generateDate") + " " + dateFormat.format(new java.util.Date()));
        generatedRun.setFontSize(12.0);
        generatedRun.setFontColor(Color.BLACK);
        generatedRun.setFontFamily(FONT_HELVETICA);

        generatedParagraph.setTextAlign(TextAlign.CENTER);

        generated.setAnchor(new java.awt.Rectangle(0, 480, 720, 60));

        XSLFTextShape copyright = slide.createTextBox();

        XSLFTextParagraph copyrightParagraph = copyright.addNewTextParagraph();
        XSLFTextRun copyrightRun = copyrightParagraph.addNewTextRun();
        copyrightRun.setText((String) i18n.get("copyright"));
        copyrightRun.setFontSize(12.0);
        copyrightRun.setFontColor(Color.BLACK);
        copyrightRun.setFontFamily(FONT_HELVETICA);

        copyrightParagraph.setTextAlign(TextAlign.CENTER);

        copyright.setAnchor(new java.awt.Rectangle(0, 500, 720, 60));
    }

    private void addProjectDescription(XSLFSlide slide, String description) {
        // Ajouter une forme de texte à la diapositive
        XSLFTextShape descriptionShape = slide.createTextBox();

        // Définir le texte et le style de la forme de texte
        XSLFTextParagraph descriptionParagraph = descriptionShape.addNewTextParagraph();
        XSLFTextRun descriptionRun = descriptionParagraph.addNewTextRun();
        descriptionRun.setText(description);
        descriptionRun.setFontSize(14.0);
        descriptionRun.setFontColor(Color.BLACK);
        descriptionRun.setFontFamily(FONT_HELVETICA);

        // Centrer le texte
        descriptionParagraph.setTextAlign(TextAlign.JUSTIFY);

        // Positionner la forme de texte
        descriptionShape.setAnchor(new java.awt.Rectangle(60, 100, 600, 400));
    }

    private void addStartEndDates(XSLFSlide slide, String startDate, String endDate) {
        // start box
        XSLFTextShape startShape = slide.createTextBox();

        XSLFTextParagraph startParagraph = startShape.addNewTextParagraph();
        XSLFTextRun startRun = startParagraph.addNewTextRun();
        startRun.setText(startDate);
        startRun.setFontSize(14.0);
        startRun.setFontColor(Color.BLACK);
        startRun.setFontFamily(FONT_HELVETICA);

        startParagraph.setTextAlign(TextAlign.LEFT);

        startShape.setAnchor(new java.awt.Rectangle(20, 50, 200, 60));

        // end line box
        XSLFTextShape endShape = slide.createTextBox();

        XSLFTextParagraph endParagraph = endShape.addNewTextParagraph();
        XSLFTextRun endRun = endParagraph.addNewTextRun();
        endRun.setText(endDate);
        endRun.setFontSize(14.0);
        endRun.setFontColor(Color.BLACK);
        endRun.setFontFamily(FONT_HELVETICA);

        endParagraph.setTextAlign(TextAlign.RIGHT);

        endShape.setAnchor(new java.awt.Rectangle(480, 50, 220, 60));
    }

    private void addMembers(XSLFSlide slide, List<UserDTO> members) {
        // Ajouter une forme de tableau à la diapositive
        XSLFTable table = slide.createTable();

        // Définir la taille du tableau
        table.setAnchor(new java.awt.Rectangle(60, 100, 600, 400));

        // Ajouter les membres au tableau
        for (UserDTO member : members) {
            XSLFTableRow row = table.addRow();

            XSLFTableCell cell = row.addCell();
            cell.setText(member.getFirstName());
            cell.setBorderColor(BorderEdge.top, Color.BLACK);
            cell.setBorderColor(BorderEdge.bottom, Color.BLACK);
            cell.setBorderColor(BorderEdge.left, Color.BLACK);
            cell.setBorderColor(BorderEdge.right, Color.BLACK);

            cell = row.addCell();
            cell.setText(member.getLastName());
            cell.setBorderColor(BorderEdge.top, Color.BLACK);
            cell.setBorderColor(BorderEdge.bottom, Color.BLACK);
            cell.setBorderColor(BorderEdge.left, Color.BLACK);
            cell.setBorderColor(BorderEdge.right, Color.BLACK);
        }

        table.setColumnWidth(0, 300);
        table.setColumnWidth(1, 300);
    }

    private void addRLPage(XMLSlideShow document, Assessment.ReadinessLevelRank readinessLevelRank, byte[] linearGraph, Map<String, ?> i18n) throws IOException {
        XSLFSlide gaugeSlide = document.createSlide();
        addTitle(gaugeSlide, readinessLevelRank.getReadinessLevel().getName());
        addRLComponents(document, gaugeSlide, readinessLevelRank);
        

        XSLFSlide commentAndLinearSlide = document.createSlide();
        addTitle(commentAndLinearSlide, readinessLevelRank.getReadinessLevel().getName());
        addRlComment(commentAndLinearSlide, readinessLevelRank, i18n);
        addLinearGraphImage(document, commentAndLinearSlide, linearGraph);
    }

    private void addRLComponents(XMLSlideShow document, XSLFSlide slide, Assessment.ReadinessLevelRank readinessLevelRank) throws IOException {
        // Ajouter une forme d'image à la diapositive
        URL imageUrl = getClass().getClassLoader().getResource("assets/rl2.png");
        byte[] pictureData = IOUtils.toByteArray(imageUrl.openStream());
        XSLFPictureData imgData = document.addPicture(pictureData, PictureType.PNG);
        XSLFPictureShape picture = slide.createPicture(imgData);

        // Définir la taille et la position de l'image
        int imgWidth = 100;
        int imgHeight = (int)(imgWidth * picture.getPictureData().getImageDimension().getHeight() / picture.getPictureData().getImageDimension().getWidth());
        picture.setAnchor(new java.awt.Rectangle(40, 80, imgWidth, imgHeight));

        // Readiness level descriptions
        for (ReadinessLevel.Level rl : readinessLevelRank.getReadinessLevel().getLevels()) {
            // Ajouter une forme de tableau à la diapositive
            XSLFTextShape textShape = slide.createTextBox();

            XSLFTextRun r = textShape.addNewTextParagraph().addNewTextRun();
            r.setText(rl.getShortDescription());
            r.setFontSize(12.0);
            r.setFontColor(rl.getLevel() == readinessLevelRank.getRank() ? Color.BLACK : Color.GRAY);
            r.setBold(rl.getLevel() == readinessLevelRank.getRank());
            r.setFontFamily(FONT_HELVETICA);

            textShape.setAnchor(new java.awt.Rectangle(50 + imgWidth, 55 + ((9 - rl.getLevel()) * 38) + 35, 550, 27));
        }
    }

    private void addRlComment(XSLFSlide slide, Assessment.ReadinessLevelRank readinessLevelRank, Map<String, ?> i18n) {
        // Ajouter une forme de texte à la diapositive
        XSLFTextShape commentShape = slide.createTextBox();

        // Définir le texte et le style de la forme de texte
        XSLFTextParagraph commentParagraph = commentShape.addNewTextParagraph();
        XSLFTextRun titleRun = commentParagraph.addNewTextRun();
        titleRun.setText(i18n.get("comment") + "\n" + readinessLevelRank.getComment());
        titleRun.setFontSize(12.0);
        titleRun.setFontColor(Color.BLACK);
        titleRun.setFontFamily(FONT_HELVETICA);

        // Centrer le texte
        commentParagraph.setTextAlign(TextAlign.JUSTIFY);

        // Positionner la forme de texte
        commentShape.setAnchor(new java.awt.Rectangle(60, 60, 600, 200));
    }

    private void addLinearGraphImage(XMLSlideShow document, XSLFSlide slide, byte[] linearGraph) {
        // Ajouter une forme d'image à la diapositive
        XSLFPictureData imgData = document.addPicture(linearGraph, PictureType.PNG);
        XSLFPictureShape picture = slide.createPicture(imgData);

        // Définir la taille et la position de l'image
        int imgWidth = 570;
        int imgHeight = (int)(imgWidth * picture.getPictureData().getImageDimension().getHeight() / picture.getPictureData().getImageDimension().getWidth());
        picture.setAnchor(new java.awt.Rectangle(60, 260, imgWidth, imgHeight));
    }
    
}
