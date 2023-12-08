package fr.eseo.pfe.xrlonline.model.dto;

import java.util.Date;
import java.util.List;

import fr.eseo.pfe.xrlonline.model.entity.ReadinessLevel;
import lombok.Data;

@Data
public class AssessmentDTO {
    
    private Date date;
    private Tag tag;
    private String comment;
    private List<ReadinessLevelRankDTO> readinessLevelRanks;

    @Data
    private static class ReadinessLevelRankDTO {
        private ReadinessLevel readinessLevel;
        private int rank;
        private String comment;
    }

    public enum Tag {
        INITIAL,
        DRAFT,
        FINAL
      }
}
