package fr.eseo.pfe.xrlonline.repository;

import fr.eseo.pfe.xrlonline.model.entity.ReadinessLevel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReadinessLevelRepository extends MongoRepository<ReadinessLevel, String> {
    ReadinessLevel findByName(String name);
}
