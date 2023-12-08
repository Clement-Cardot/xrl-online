package fr.eseo.pfe.xrlonline.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

  @JsonIgnore
  public boolean isAdmin() {
    return login.equals("admin");
  }
}
