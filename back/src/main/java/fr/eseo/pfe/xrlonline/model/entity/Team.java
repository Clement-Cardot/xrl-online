package fr.eseo.pfe.xrlonline.model.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "teams")
public class Team {

  @Id
  private String id;
  private String name;
  @DBRef
  private List<User> members;
}
