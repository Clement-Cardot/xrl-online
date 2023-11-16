package fr.eseo.pfe.xrlonline.model.dto;

import lombok.Data;

@Data
public class BusinessLineDTO {

    private String id;
    private String name;

    @Override
    public String toString() {
        return "BusinessLineDTO{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                '}';
    }
}
