package fr.eseo.pfe.xrlonline.repository;

import fr.eseo.pfe.xrlonline.model.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    User findByLogin(String login);

}
