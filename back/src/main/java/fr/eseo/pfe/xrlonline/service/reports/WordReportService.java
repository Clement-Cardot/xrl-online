package fr.eseo.pfe.xrlonline.service.reports;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.util.Units;
import org.apache.poi.xwpf.usermodel.Document;
import org.apache.poi.xwpf.usermodel.ParagraphAlignment;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.apache.poi.xwpf.usermodel.XWPFTableCell;
import org.apache.poi.xwpf.usermodel.XWPFTableRow;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.itextpdf.text.BadElementException;
import com.itextpdf.text.Image;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.ProjectDTO;
import fr.eseo.pfe.xrlonline.model.dto.ReportProjectDTO;
import fr.eseo.pfe.xrlonline.model.entity.Assessment;
import fr.eseo.pfe.xrlonline.model.entity.Project;
import fr.eseo.pfe.xrlonline.model.entity.ReadinessLevel;

@Service
public class WordReportService {

    private ModelMapper modelMapper;

    private ReportTranslationService reportTranslationService;

    public WordReportService(ModelMapper modelMapper, ReportTranslationService reportTranslationService) {
        this.modelMapper = modelMapper;
        this.reportTranslationService = reportTranslationService;
    }

    public byte[] createWord(ProjectDTO projectDTO, ReportProjectDTO reportProjectDTO) throws CustomRuntimeException {
        XWPFDocument document = new XWPFDocument();        

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try {
            // Write project information into document
            this.writeFile(document, projectDTO, reportProjectDTO);
            document.write(baos);

        } catch (IOException | BadElementException e) {
            throw new CustomRuntimeException("Error while creating word document");
        }

        return baos.toByteArray();
    }

    private void writeFile(XWPFDocument document, ProjectDTO projectDTO, ReportProjectDTO reportProjectDTO) throws CustomRuntimeException, BadElementException {
        Map<String, String> i18n = this.reportTranslationService.getTranslations(reportProjectDTO.getLang());

        Project project = modelMapper.map(projectDTO, Project.class);

        try {
            // First Page
            this.addTitle(document, projectDTO.getName());
            this.addTwoTexts(document, i18n.get("team") + ": " + projectDTO.getTeam().getName(), i18n.get("businessLine") + ": " + projectDTO.getBusinessLine().getName());
            this.addImage(document, reportProjectDTO.getLastXrlGraphDecoded());

            // RL pages
            for (Assessment.ReadinessLevelRank readinessLevelRank : project.getLastAssessment().getReadinessLevelRanks()) {
                addRLPage(document, readinessLevelRank, i18n, reportProjectDTO.getLinearGraphDecoded(readinessLevelRank.getReadinessLevel().getName()));
            }


        } catch (InvalidFormatException | IOException e) {
            throw new CustomRuntimeException(CustomRuntimeException.INTERNAL_SERVER_ERROR, e);
        }
    }

    private void addTitle(XWPFDocument document, String title) {
        XWPFParagraph paragraph = document.createParagraph();
        paragraph.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun run = paragraph.createRun();
        run.setBold(true);
        run.setFontSize(20);
        run.setText(title);
    }

    private void addTwoTexts(XWPFDocument document, String leftText, String rightText) {
        // Créer une nouvelle table
        XWPFTable table = document.createTable(1, 2);
        table.setWidth("100%");

        // Ajouter deux cellules à la table
        XWPFTableRow row = table.getRow(0);
        XWPFTableCell cell1 = row.getCell(0);
        XWPFTableCell cell2 = row.getCell(1);

        // Créer deux paragraphes, un pour chaque texte
        XWPFParagraph leftParagraph = cell1.addParagraph();
        leftParagraph.setAlignment(ParagraphAlignment.LEFT);
        XWPFRun leftRun = leftParagraph.createRun();
        leftRun.setText(leftText);

        XWPFParagraph rightParagraph = cell2.addParagraph();
        rightParagraph.setAlignment(ParagraphAlignment.RIGHT);
        XWPFRun rightRun = rightParagraph.createRun();
        rightRun.setText(rightText);
    }

    private void addImage(XWPFDocument document, byte[] img) throws InvalidFormatException, IOException {
        // Créer un nouveau paragraphe
        XWPFParagraph paragraph = document.createParagraph();
        paragraph.setAlignment(ParagraphAlignment.CENTER);
        paragraph.setSpacingBefore(20);

        // Ajouter l'image au paragraphe
        XWPFRun run = paragraph.createRun();
        run.addPicture(new ByteArrayInputStream(img), Document.PICTURE_TYPE_JPEG, "image.jpg", Units.toEMU(400), Units.toEMU(400));
    }

    private void addRLPage(XWPFDocument document, Assessment.ReadinessLevelRank readinessLevelRank, Map<String, String> i18n, byte[] linearGraph) throws InvalidFormatException, IOException, BadElementException, CustomRuntimeException {
        XWPFParagraph paragraphTitle = document.createParagraph();
        paragraphTitle.setAlignment(ParagraphAlignment.CENTER);
        paragraphTitle.setPageBreak(true);
        XWPFRun run = paragraphTitle.createRun();
        run.setBold(true);
        run.setFontFamily("Helvetica bold");
        run.setFontSize(18);
        run.setText(readinessLevelRank.getReadinessLevel().getName());

        this.addRLComponents(document, readinessLevelRank);
        this.addRlComment(document, readinessLevelRank, i18n);
        this.addLinearGraphImage(document, linearGraph);
    }

    private void addRLComponents(XWPFDocument document, Assessment.ReadinessLevelRank readinessLevelRank) throws CustomRuntimeException, BadElementException, IOException, InvalidFormatException {
        // Créer une nouvelle table
        XWPFTable table = document.createTable(1, 2);
        table.setWidth("100%");

        XWPFTableCell imagCell = table.getRow(0).getCell(0);

        // Image of the readiness level
        URL imageUrl = getClass().getClassLoader().getResource("assets/rl2.png");
        Image image = Image.getInstance(Objects.requireNonNull(imageUrl));
        float ratio = image.getHeight() / image.getWidth();

      XWPFParagraph paragraph = imagCell.addParagraph();
        XWPFRun run = paragraph.createRun();
        InputStream imageStream = null;
        try {
            imageStream = imageUrl.openStream();
            run.addPicture(imageStream, Document.PICTURE_TYPE_PNG, "rl2.png", Units.toEMU(70), Math.round(Units.toEMU(70)*ratio));
            
        } catch (IOException e) {
            throw new CustomRuntimeException(CustomRuntimeException.INTERNAL_SERVER_ERROR, e);
        } finally {
            if (imageStream != null) {
                imageStream.close();
            }
        }

        run.addBreak();
        
        // // Readiness level descriptions

        XWPFTableCell levelCell = table.getRow(0).getCell(1);
        XWPFParagraph emptyParagraph = levelCell.addParagraph();
        emptyParagraph.setSpacingAfter(100);

        List<ReadinessLevel.Level> levels = readinessLevelRank.getReadinessLevel().getLevels();
        Collections.reverse(levels);
        for (ReadinessLevel.Level rl : levels) {
            XWPFParagraph levelParagraph = levelCell.addParagraph();
            levelParagraph.setAlignment(ParagraphAlignment.LEFT);
            levelParagraph.setSpacingAfter(250);

            XWPFRun levelRun = levelParagraph.createRun();
            levelRun.setText(rl.getShortDescription());
            levelRun.setFontSize(10);
            levelRun.setColor(rl.getLevel() == readinessLevelRank.getRank() ? "000000" : "808080");
            levelRun.setVerticalAlignment("center");
            levelRun.setBold(false);
            levelRun.setFontFamily("Helvetica");
        }
    }

    private void addRlComment(XWPFDocument document, Assessment.ReadinessLevelRank readinessLevelRank, Map<String, String> i18n) {
        // Créer un nouveau paragraphe
        XWPFParagraph paragraph = document.createParagraph();

        // Ajouter le texte au paragraphe
        XWPFRun run = paragraph.createRun();
        run.setText(i18n.get("comment") + "\n" + readinessLevelRank.getComment());

        // Créer une nouvelle table
        XWPFTable table = document.createTable();

        // Ajouter une cellule à la table
        XWPFTableRow row = table.getRow(0);
        if (row == null) {
            row = table.createRow();
        }
        XWPFTableCell cell = row.getCell(0);
        if (cell == null) {
            cell = row.createCell();
        }

        // Ajouter le paragraphe à la cellule
        cell.addParagraph(paragraph);
    }

    private void addLinearGraphImage(XWPFDocument document, byte[] linearGraph) throws InvalidFormatException, IOException {
        XWPFParagraph paragraph = document.createParagraph();
        paragraph.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun run = paragraph.createRun();
        
        InputStream inputStream = new ByteArrayInputStream(linearGraph);
        run.addPicture(inputStream, Document.PICTURE_TYPE_PNG, "image", Units.toEMU(400), Units.toEMU(400));
    }
}
