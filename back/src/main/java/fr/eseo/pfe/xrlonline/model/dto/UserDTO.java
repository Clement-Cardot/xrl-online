package fr.eseo.pfe.xrlonline.model.dto;

import lombok.Data;

@Data
public class UserDTO {

    private String id;
    private String login;
    private String lastName;
    private String firstName;

    @Override
    public String toString() {
        return "UserDTO{ id=" + id + ", login=" + login + ", lastName=" + lastName + ", firstName=" + firstName + " }";
    }
}
