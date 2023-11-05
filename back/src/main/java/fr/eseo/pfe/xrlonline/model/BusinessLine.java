package fr.eseo.pfe.xrlonline.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "businesslines")
public class BusinessLine {

  @Id
  private String id;
  private String name;
}
