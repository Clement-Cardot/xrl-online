package fr.eseo.pfe.xrlonline.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "users")
public class User {

  @Id
  private String id;
  private String login;
  private String lastName;
  private String firstName;
}
