package fr.eseo.pfe.xrlonline.model.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "readinesslevels")
public class ReadinessLevel {

  @Id
  private String id;
  private String name;
  private String description;
  private List<Level> levels;

  @Override
  public String toString() {
    return "ReadinessLevel{" +
        "id='" + id + '\'' +
        ", name='" + name + '\'' +
        '}';
  }

  @Data
  public static class Level {
    private List<String> longDescription;
    private String shortDescription;
    private int level;

  }
}
