package fr.eseo.pfe.xrlonline.model.dto;

import fr.eseo.pfe.xrlonline.model.entity.Assessment;
import fr.eseo.pfe.xrlonline.model.entity.BusinessLine;
import fr.eseo.pfe.xrlonline.model.entity.Team;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.List;

@Data
public class ProjectDTO {

  @Id
  private String id;
  private String name;
  private String description;
  private Team team;
  private BusinessLine businessLine;
  private List<Assessment> assessments;
}
