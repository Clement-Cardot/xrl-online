package fr.eseo.pfe.xrlonline.model.dto;

import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.List;

@Data
public class ProjectDTO {

  @Id
  private String id;
  private String name;
  private String description;
  private TeamDTO team;
  private BusinessLineDTO businessLine;
  private List<AssessmentDTO> assessments;

  @Override
  public String toString() {
    return "ProjectDTO{" +
        "id='" + id + '\'' +
        ", name='" + name + '\'' +
        ", teamDTO=" + team.getName() +
        ", businessLineDTO=" + businessLine.getName() +
        ", assessmentsDTO=" + assessments.toString() +
        '}';
  }
}
