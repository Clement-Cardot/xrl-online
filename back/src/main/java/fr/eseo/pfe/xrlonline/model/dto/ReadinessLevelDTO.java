package fr.eseo.pfe.xrlonline.model.dto;

import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.List;

@Data
public class ReadinessLevelDTO {

  @Id
  private String id;
  private String name;
  private String description;
  private List<LevelDTO> levels;
  private Boolean isUsed;

  @Override
  public String toString() {
    return "ReadinessLevelDTO{" +
        "id='" + id + '\'' +
        ", name='" + name + '\'' +
        '}';
  }

  @Data
  public static class LevelDTO {
    private List<String> longDescription;
    private String shortDescription;
    private int level;
  }
}
