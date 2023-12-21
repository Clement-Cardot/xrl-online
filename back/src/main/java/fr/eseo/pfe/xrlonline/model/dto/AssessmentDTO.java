package fr.eseo.pfe.xrlonline.model.dto;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class AssessmentDTO {
    
    private Date date;
    private TagDTO tag;
    private String comment;
    private List<ReadinessLevelRankDTO> readinessLevelRanks;

    @Override
    public String toString() {
        return "AssessmentDTO{" +
            "date=" + date +
            ", tag=" + tag +
            ", readinessLevelsRankDTOs=" + readinessLevelRanks +
            '}';
    }

    @Data
    private static class ReadinessLevelRankDTO {
        private ReadinessLevelDTO readinessLevel;
        private int rank;
        private String comment;

        @Override
        public String toString() {
            return "ReadinessLevelRankDTO{" +
                "readinessLevelDTO=" + readinessLevel.getName() +
                ", rank=" + rank +
                '}';
        }
    }

    public enum TagDTO {
        INITIAL,
        INTERMEDIATE,
        FINAL,
        DRAFT
    }
}