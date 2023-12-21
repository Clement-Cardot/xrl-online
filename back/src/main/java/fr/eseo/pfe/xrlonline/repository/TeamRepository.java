package fr.eseo.pfe.xrlonline.repository;

import fr.eseo.pfe.xrlonline.model.entity.Team;
import fr.eseo.pfe.xrlonline.model.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends MongoRepository<Team, String> {
    Team findByName(String name);

    List<Team> findByMembers(User user);
}