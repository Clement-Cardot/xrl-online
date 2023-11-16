package fr.eseo.pfe.xrlonline.model.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "projects")
public class Project {

  @Id
  private String id;
  private String name;
  private String description;
  @DBRef
  private Team team;
  @DBRef
  private BusinessLine businessLine;
  private List<Assessment> assessments;

  @Override
  public String toString() {
    return "Project{" +
        "id='" + id + '\'' +
        ", name='" + name + '\'' +
        ", description='" + description + '\'' +
        ", team=" + team.getName() +
        ", businessLine=" + businessLine.getName() +
        ", assessments=" + assessments.toString() +
        '}';
  }
}
