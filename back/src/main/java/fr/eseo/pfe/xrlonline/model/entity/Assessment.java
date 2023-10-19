package fr.eseo.pfe.xrlonline.model.entity;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class Assessment {

  private Date date;
  private Tag tag;
  private String comment;
  private List<ReadinessLevelRank> readinessLevels;

  @Data
  private static class ReadinessLevelRank {
    private ReadinessLevel readinessLevel;
    private int rank;
    private String comment;
  }

  enum Tag {
    INITIAL,
    FINAL,
    COMPLETED
  }
}
