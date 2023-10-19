package fr.eseo.pfe.xrlonline.model.dto;

import fr.eseo.pfe.xrlonline.model.entity.User;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.stereotype.Component;

import java.util.List;

@Data
public class TeamDTO {

    private String id;
    private String name;
    private List<User> members;
}
