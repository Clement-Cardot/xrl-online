package fr.eseo.pfe.xrlonline.model.dto;

import lombok.Data;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonIgnore;

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

  @JsonIgnore
  public AssessmentDTO getLastAssessment() {
  // Return the last assessment depending on the date attribut
  return assessments.stream()
      .max((a1, a2) -> a1.getDate().compareTo(a2.getDate()))
      .orElse(null);
  }
  
  @JsonIgnore
  public AssessmentDTO getInitialAssessment() {
    return assessments.stream().filter(a -> a.getTag() == AssessmentDTO.TagDTO.INITIAL).findFirst().orElse(null);
  }

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
