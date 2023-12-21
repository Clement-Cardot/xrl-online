package fr.eseo.pfe.xrlonline.repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import fr.eseo.pfe.xrlonline.model.entity.Project;

@Repository
public class CustomRequestRepository {

    private MongoTemplate mongoTemplate;

    public CustomRequestRepository(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }
    
    public Boolean isReadinessLevelUsed(String readinessLevelId) {
        MatchOperation matchOperation = Aggregation.match(Criteria.where("assessments.readinessLevelRanks.readinessLevel.$id").is(new ObjectId(readinessLevelId)));

        Aggregation aggregation = Aggregation.newAggregation(matchOperation);

        List<Project> results = mongoTemplate.aggregate(aggregation, "projects", Project.class).getMappedResults();

        return !results.isEmpty();
    }
}
