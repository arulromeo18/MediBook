package com.hospital.hospitalsystem.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "hospitals")
public class Hospital {

    @Id
    private String id;

    @Indexed
    private String name;

    @Indexed
    private String city;
}
