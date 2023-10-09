package fr.eseo.pfe.xrlonline.repository;

import fr.eseo.pfe.xrlonline.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {
}
