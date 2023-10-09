package fr.eseo.pfe.xrlonline.repository;

import fr.eseo.pfe.xrlonline.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {

      User findByFirstName(String firstName);

      User findByLogin(String login);

      User findByLastName(String lastName);
}
