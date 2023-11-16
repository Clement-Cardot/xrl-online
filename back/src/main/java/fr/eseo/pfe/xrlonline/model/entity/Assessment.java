package fr.eseo.pfe.xrlonline.model.entity;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.Date;
import java.util.List;

@Data
public class Assessment {

  private Date date;
  private Tag tag;
  private String comment;
  private List<ReadinessLevelRank> readinessLevels;

  @Override
  public String toString() {
    return "Assessment{" +
        "date=" + date +
        ", tag=" + tag +
        ", comment='" + comment + '\'' +
        ", readinessLevels=" + readinessLevels +
        '}';
  }

  @Data
  private static class ReadinessLevelRank {
    @DBRef
    private ReadinessLevel readinessLevel;
    private int rank;
    private String comment;

    @Override
    public String toString() {
      return "ReadinessLevelRank{" +
          "readinessLevel=" + readinessLevel.getName() +
          ", rank=" + rank +
          ", comment='" + comment + '\'' +
          '}';
    }
  }

  enum Tag {
    INITIAL,
    FINAL,
    COMPLETED
  }
}
