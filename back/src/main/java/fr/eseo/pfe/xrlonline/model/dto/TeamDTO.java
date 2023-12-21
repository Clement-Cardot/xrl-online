package fr.eseo.pfe.xrlonline.model.dto;

import lombok.Data;

import java.util.List;

@Data
public class TeamDTO {

    private String id;
    private String name;
    private List<UserDTO> members;

    @Override
    public String toString() {
        return "TeamDTO{ id=" + id + ", name=" + name + ", members=" + members + " }";
    }
}
