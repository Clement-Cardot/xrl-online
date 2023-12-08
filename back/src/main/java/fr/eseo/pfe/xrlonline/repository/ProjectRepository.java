package fr.eseo.pfe.xrlonline.repository;

import fr.eseo.pfe.xrlonline.model.entity.BusinessLine;
import fr.eseo.pfe.xrlonline.model.entity.Project;
import fr.eseo.pfe.xrlonline.model.entity.Team;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {
  Project findByName(String name);
  List<Project> findByTeam(Team team);
  List<Project> findByBusinessLine(BusinessLine businessLine);
}
