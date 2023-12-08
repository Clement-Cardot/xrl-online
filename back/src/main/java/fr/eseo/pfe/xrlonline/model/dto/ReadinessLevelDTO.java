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

  @Data
  public static class LevelDTO {
    private List<String> longDescription;
    private String shortDescription;
    private int level;
  }
}
