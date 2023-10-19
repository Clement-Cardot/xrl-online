package fr.eseo.pfe.xrlonline.repository;

import fr.eseo.pfe.xrlonline.model.entity.BusinessLine;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusinessLineRepository extends MongoRepository<BusinessLine, String> {
}
