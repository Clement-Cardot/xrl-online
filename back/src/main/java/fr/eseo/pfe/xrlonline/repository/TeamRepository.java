package fr.eseo.pfe.xrlonline.repository;

import fr.eseo.pfe.xrlonline.model.entity.Team;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamRepository extends MongoRepository<Team, String> {
    Team findByName(String name);
}