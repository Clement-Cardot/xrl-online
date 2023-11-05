package fr.eseo.pfe.xrlonline.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "projects")
public class Project {

  @Id
  private String id;
  private String name;
  private String comment;
  private Team team;
  private BusinessLine businessLine;
  private List<Assessment> assessments;
}
