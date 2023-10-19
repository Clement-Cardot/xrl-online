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

  public void setLevels(List<Level> levels) {
    if (levels.size() != 9) throw new IllegalArgumentException("There must be 9 levels");
    this.levels = levels;
  }

  public void addLevel(Level level) {
    if (levels.size() == 9) throw new IllegalArgumentException("There must be 9 levels");
    this.levels.add(level);
  }

  @Data
  private static class Level {
    private String longDescription;
    private String shortDescription;
    private int level;

    public void setLevel(int level) {
      if (level < 1 || level > 9) throw new IllegalArgumentException("Level must be between 1 and 9");
      this.level = level;
    }
  }
}
