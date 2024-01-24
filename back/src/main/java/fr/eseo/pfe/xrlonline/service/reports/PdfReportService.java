package fr.eseo.pfe.xrlonline.service.reports;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.ProjectDTO;
import fr.eseo.pfe.xrlonline.model.dto.ReportProjectDTO;
import fr.eseo.pfe.xrlonline.model.dto.UserDTO;
import fr.eseo.pfe.xrlonline.model.entity.Assessment;
import fr.eseo.pfe.xrlonline.model.entity.Project;
import fr.eseo.pfe.xrlonline.model.entity.ReadinessLevel;
import lombok.Getter;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class PdfReportService {

  private ModelMapper modelMapper;

  private ReportTranslationService reportTranslationService;

  private static final String DATE_FORMAT = "dd/MM/yyyy";

  public PdfReportService(ModelMapper modelMapper, ReportTranslationService reportTranslationService) {
    this.modelMapper = modelMapper;
    this.reportTranslationService = reportTranslationService;
  }

  public byte[] createPDF(ProjectDTO projectDTO, ReportProjectDTO reportProjectDTO) throws CustomRuntimeException {
    Document document = new Document();
    Project project = modelMapper.map(projectDTO, Project.class);
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    Map<String, String> i18n = this.reportTranslationService.getTranslations(reportProjectDTO.getLang());

    try {
      PdfWriter writer = PdfWriter.getInstance(document, baos);
      document.open();
      addTitle(document, i18n.get("title").replace("${name}", projectDTO.getName()));
      addTwoTexts(document, i18n.get("team") + ": " + project.getTeam().getName(), i18n.get("businessLine") + ": " + projectDTO.getBusinessLine().getName());
      float height = addDescription(writer, projectDTO.getDescription());
      addCurrentGraphImage(document, writer, reportProjectDTO.getLastXrlGraphDecoded(), height, project.getLastAssessment().getDate());
      Date endDate = project.getLastAssessment().getTag() == Assessment.Tag.FINAL ? project.getLastAssessment().getDate() : null;
      addProjectDates(writer, project.getInitialAssessment().getDate(), endDate, i18n);
      addGenerationDate(writer, i18n);
      addKthLicense(writer);

      document.newPage();
      addMembersPageTitle(document, i18n.get("teamMembers"));
      addTeamMembers(document, projectDTO.getTeam().getMembers());

      //create rl pages
      for (Assessment.ReadinessLevelRank readinessLevelRank : project.getLastAssessment().getReadinessLevelRanks()) {
        addRLPage(document, writer, readinessLevelRank, i18n,
            reportProjectDTO.getLinearGraphDecoded(readinessLevelRank.getReadinessLevel().getName()));
      }

      //summary page
      if (project.getAssessments().size() > 1) {
        document.newPage();
        addTitleSummary(document, i18n.get("summary"));
        addSummaryImageComponent(document, i18n.get("compareWithInitialGraph"), reportProjectDTO.getCompareWithInitialGraphDecoded());
        addSummaryImageComponent(document, i18n.get("compareTwoLastGraphs"), reportProjectDTO.getCompareTwoLastGraphsDecoded());
        addSummaryImageComponent(document, i18n.get("completeLinearGraph"), reportProjectDTO.getCompleteLinearGraphDecoded());
      }

      //add metadata
      document.addTitle(projectDTO.getName());
      document.addSubject(i18n.get("title"));
      writer.close();
    } catch (DocumentException | IOException e) {
      throw new CustomRuntimeException(CustomRuntimeException.INTERNAL_SERVER_ERROR, e);
    } finally {
      document.close();
    }
    return baos.toByteArray();
  }

  private void addTitle(Document document, String title) throws DocumentException {
    Font titleFont = FontFactory.getFont(FONTS.BOLD.getFont(), 22);
    Paragraph titleParagraph = new Paragraph(title, titleFont);
    titleParagraph.setAlignment(Element.ALIGN_CENTER);
    titleParagraph.setSpacingAfter(60);
    document.add(titleParagraph);
  }

  private PdfPTable createTwoTexts(String leftText, String rightText) throws DocumentException {
    Font normalFont = FontFactory.getFont(FONTS.NORMAL.getFont(), 14);
    PdfPTable table = new PdfPTable(2);
    table.setWidthPercentage(100);
    table.setWidths(new int[]{1, 1});
    table.setSpacingAfter(20);

    Paragraph leftParagraph = new Paragraph(leftText, normalFont);
    leftParagraph.setAlignment(Element.ALIGN_LEFT);
    leftParagraph.setSpacingAfter(10);
    PdfPCell cell1 = new PdfPCell();
    cell1.addElement(leftParagraph);
    cell1.setBorder(Rectangle.NO_BORDER);

    Paragraph rightParagraph = new Paragraph(rightText, normalFont);
    rightParagraph.setAlignment(Element.ALIGN_RIGHT);
    rightParagraph.setSpacingAfter(10);
    PdfPCell cell2 = new PdfPCell();
    cell2.addElement(rightParagraph);
    cell2.setHorizontalAlignment(Element.ALIGN_RIGHT);
    cell2.setBorder(Rectangle.NO_BORDER);

    table.addCell(cell1);
    table.addCell(cell2);

    return table;
  }

  private void addTwoTexts(Document document, String leftText, String rightText) throws DocumentException {
    PdfPTable table = createTwoTexts(leftText, rightText);
    document.add(table);
  }

  /**
   * @return the height taken by the description
   */
  private float addDescription(PdfWriter writer, String description) throws DocumentException {
    Font descriptionFont = FontFactory.getFont(FONTS.NORMAL.getFont(), 12);
    Paragraph descriptionParagraph = new Paragraph(description, descriptionFont);
    descriptionParagraph.setAlignment(Element.ALIGN_JUSTIFIED);
    descriptionParagraph.setSpacingAfter(40);

    float currentHeight = writer.getVerticalPosition(true);
    int maxHeight = 470;
    float currentMaxHeight = currentHeight - 10;
    boolean status = true;
    while (status && currentMaxHeight > maxHeight) {
      ColumnText columnText = new ColumnText(writer.getDirectContent());
      columnText.addElement(descriptionParagraph);
      columnText.setSimpleColumn(40, currentHeight,
          writer.getPageSize().getWidth() - 40, currentMaxHeight);
      status = ColumnText.hasMoreText(columnText.go(true));
      currentMaxHeight -= 5;
    }
    ColumnText columnText = new ColumnText(writer.getDirectContent());
    columnText.addElement(descriptionParagraph);
    columnText.setSimpleColumn(40, currentHeight,
        writer.getPageSize().getWidth() - 40, currentMaxHeight);
    columnText.go();
    return currentMaxHeight;
  }

  private void addCurrentGraphImage(Document document, PdfWriter writer, byte[] img, float currentHeight, Date assessmentDate) throws DocumentException, IOException {
    Image image = Image.getInstance(img);
    image.scaleToFit(1000, 270);
    image.setAlignment(Element.ALIGN_CENTER);
    int footerHeight = 130;
    float remainingHeight = currentHeight - footerHeight;
    float absoluteY = currentHeight - remainingHeight/2 - image.getScaledHeight()/2;
    image.setAbsolutePosition((writer.getPageSize().getWidth() - image.getScaledWidth())/2, absoluteY);
    document.add(image);

    ColumnText columnText = new ColumnText(writer.getDirectContent());
    Paragraph titleParagraph = new Paragraph(new SimpleDateFormat(DATE_FORMAT).format(assessmentDate), FontFactory.getFont(FONTS.NORMAL.getFont(), 11));
    titleParagraph.setAlignment(Element.ALIGN_CENTER);
    columnText.setSimpleColumn(0, absoluteY-5, writer.getPageSize().getWidth(), absoluteY - 25);
    columnText.setAlignment(Element.ALIGN_CENTER);
    columnText.addElement(titleParagraph);
    columnText.go();
  }

  private void addProjectDates(PdfWriter writer, Date startDate, Date endDate, Map<?, ?> i18n) throws DocumentException {
    SimpleDateFormat dateFormat = new SimpleDateFormat(DATE_FORMAT);
    String endDateString = endDate == null ? "" : i18n.get("endDate") + ": " + dateFormat.format(endDate);
    PdfPTable table = createTwoTexts(i18n.get("startDate") + ": " + dateFormat.format(startDate), endDateString);
    table.setTotalWidth(writer.getPageSize().getWidth() - 80);
    table.writeSelectedRows(0, -1, 40, 120, writer.getDirectContent());
  }

  private void addGenerationDate(PdfWriter writer, Map<?, ?> i18n) {
    SimpleDateFormat dateFormat = new SimpleDateFormat(DATE_FORMAT);
    String generationDate = dateFormat.format(new Date());
    Font generationDateFont = FontFactory.getFont(FONTS.NORMAL.getFont(), 10);
    Paragraph generationDateParagraph = new Paragraph(i18n.get("generateDate") + " " + generationDate, generationDateFont);
    generationDateParagraph.setAlignment(Element.ALIGN_CENTER);
    ColumnText.showTextAligned(writer.getDirectContent(), Element.ALIGN_CENTER,
        generationDateParagraph, writer.getPageSize().getWidth() / 2, 60, 0);
  }
  private void addKthLicense(PdfWriter writer) {
    Font kthFont = FontFactory.getFont(FONTS.NORMAL.getFont(), 10);
    Paragraph kthParagraph = new Paragraph("Source Creative Commons — Attribution-NonCommercial-ShareAlike 4.0 International — CC BY-NC-SA 4.0", kthFont);
    kthParagraph.setAlignment(Element.ALIGN_CENTER);
    ColumnText.showTextAligned(writer.getDirectContent(), Element.ALIGN_CENTER,
        kthParagraph, writer.getPageSize().getWidth() / 2, 40, 0);
  }

  private void addMembersPageTitle(Document document, String title) throws DocumentException {
    Font titleFont = FontFactory.getFont(FONTS.BOLD.getFont(), 20);
    Paragraph titleParagraph = new Paragraph(title, titleFont);
    titleParagraph.setAlignment(Element.ALIGN_CENTER);
    titleParagraph.setSpacingAfter(40);
    document.add(titleParagraph);
  }

  private void addTeamMembers(Document document, List<UserDTO> members) throws DocumentException {
    Font teamMembersFont = FontFactory.getFont(FONTS.NORMAL.getFont(), 12);
    PdfPTable table = new PdfPTable(2);
    table.setWidthPercentage(70);
    table.setWidths(new int[]{1, 1});
    table.setSpacingBefore(20);

    for (UserDTO member : members) {
      Paragraph firstNameParagraph = new Paragraph(member.getFirstName(), teamMembersFont);
      firstNameParagraph.setAlignment(Element.ALIGN_LEFT);
      firstNameParagraph.setSpacingAfter(10);
      PdfPCell cell1 = new PdfPCell();
      cell1.addElement(firstNameParagraph);

      Paragraph lastNameParagraph = new Paragraph(member.getLastName(), teamMembersFont);
      lastNameParagraph.setAlignment(Element.ALIGN_LEFT);
      lastNameParagraph.setSpacingAfter(10);
      PdfPCell cell2 = new PdfPCell();
      cell2.addElement(lastNameParagraph);

      table.addCell(cell1);
      table.addCell(cell2);
    }

    document.add(table);
  }

  private void addRLPage(Document document, PdfWriter writer, Assessment.ReadinessLevelRank readinessLevelRank,
                         Map<?,?> i18n, byte[] linearGraph) throws DocumentException, IOException {
    document.newPage();

    // Readiness name title
    Paragraph titleParagraph = new Paragraph(readinessLevelRank.getReadinessLevel().getName(), FontFactory.getFont(FONTS.BOLD.getFont(), 18));
    titleParagraph.setAlignment(Element.ALIGN_CENTER);
    titleParagraph.setSpacingAfter(20);
    document.add(titleParagraph);

    addRlComponent(document, writer, readinessLevelRank);
    addRlComment(writer, readinessLevelRank, i18n);

    if (linearGraph != null) addLinearGraphImage(document, writer, linearGraph);
  }

  private void addRlComponent(Document document, PdfWriter writer, Assessment.ReadinessLevelRank readinessLevelRank) throws DocumentException, IOException {
    // Image of the readiness level
    URL imageUrl = getClass().getClassLoader().getResource("assets/rl.png");
    Image image = Image.getInstance(Objects.requireNonNull(imageUrl));
    float ratio = image.getHeight() / image.getWidth();
    int imgWidth = 70;
    image.scaleToFit(imgWidth, imgWidth * ratio);
    int imgX = 80;
    int imgY = 450;
    image.setAbsolutePosition(imgX, imgY);
    document.add(image);

    Rectangle pageSize = document.getPageSize();

    // Readiness level descriptions
    for (ReadinessLevel.Level rl : readinessLevelRank.getReadinessLevel().getLevels()) {
      PdfContentByte canvas = writer.getDirectContent();
      ColumnText columnText = new ColumnText(canvas);
      columnText.setAlignment(Element.ALIGN_CENTER);
      int y = imgY + (rl.getLevel() * 27) + 42;
      Rectangle rect = new Rectangle((float) imgX + imgWidth, y, pageSize.getWidth() - imgX, (float) y - 27);
      columnText.setSimpleColumn(rect);

      Font rlFont = FontFactory.getFont(FONTS.NORMAL.getFont(), 10);
      rlFont.setColor(rl.getLevel() == readinessLevelRank.getRank() ? BaseColor.BLACK : BaseColor.GRAY);
      Paragraph paragraph = new Paragraph(rl.getShortDescription(), rlFont);
      paragraph.setLeading(10);
      PdfPCell cell = new PdfPCell();
      cell.addElement(paragraph);
      cell.setBorder(Rectangle.NO_BORDER);
      cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
      cell.setFixedHeight(27);
      cell.setPadding(0);
      PdfPTable table = new PdfPTable(1);
      table.setWidthPercentage(100);
      table.addCell(cell);
      columnText.addElement(table);
      columnText.go();

      // Add number on image
      Font nbFont = FontFactory.getFont(FONTS.BOLD.getFont(), 12);
      nbFont.setColor(BaseColor.WHITE);
      Paragraph nb = new Paragraph(String.valueOf(rl.getLevel()), nbFont);
      ColumnText nbText = new ColumnText(writer.getDirectContent());
      nbText.setSimpleColumn(imgX + 9 + (float) imgWidth / 2, y, (float) imgX + 29, (float) y - 20);
      nbText.addElement(nb);
      nbText.go();
    }
  }

  private void addRlComment(PdfWriter writer, Assessment.ReadinessLevelRank readinessLevelRank, Map<?,?> i18n) throws DocumentException {
    ColumnText columnText = new ColumnText(writer.getDirectContent());
    Rectangle rect = new Rectangle(80, 260, 500, 420);
    columnText.setSimpleColumn(rect);
    Paragraph comment = new Paragraph(i18n.get("comment") + "\n" + readinessLevelRank.getComment(), FontFactory.getFont(FONTS.NORMAL.getFont(), 12));
    PdfPTable table = new PdfPTable(1);
    table.setWidthPercentage(100);
    PdfPCell cell = new PdfPCell();
    cell.addElement(comment);
    cell.setFixedHeight(rect.getHeight());
    cell.setPadding(8);
    table.addCell(cell);
    columnText.addElement(table);
    columnText.go();
  }

  private void addLinearGraphImage(Document document, PdfWriter writer, byte[] img) throws DocumentException, IOException {
    Rectangle pageSize = document.getPageSize();
    Image image = Image.getInstance(img);
    image.scaleToFit(pageSize.getWidth() - 160, 200);
    image.setAlignment(Element.ALIGN_CENTER);
    image.setAbsolutePosition((writer.getPageSize().getWidth() - image.getScaledWidth())/2, 50);
    document.add(image);
  }

  private void addTitleSummary(Document document, String title) throws DocumentException {
    Font titleFont = FontFactory.getFont(FONTS.BOLD.getFont(), 18);
    Paragraph titleParagraph = new Paragraph(title, titleFont);
    titleParagraph.setAlignment(Element.ALIGN_CENTER);
    titleParagraph.setSpacingAfter(30);
    document.add(titleParagraph);
  }
  private void addSummaryImageComponent(Document document, String text, byte[] img) throws DocumentException, IOException {
    Rectangle pageSize = document.getPageSize();
    Image image = Image.getInstance(img);
    image.scaleToFit(pageSize.getWidth() - 160, 200);
    image.setAlignment(Element.ALIGN_CENTER);
    document.add(image);

    Paragraph titleParagraph = new Paragraph(text, FontFactory.getFont(FONTS.NORMAL.getFont(), 11));
    titleParagraph.setAlignment(Element.ALIGN_CENTER);
    titleParagraph.setSpacingAfter(20);
    document.add(titleParagraph);
  }

  @Getter
  enum FONTS {
    NORMAL(FontFactory.HELVETICA),
    BOLD(FontFactory.HELVETICA_BOLD);

    private final String font;

    FONTS(String font) {
      this.font = font;
    }

  }
}
