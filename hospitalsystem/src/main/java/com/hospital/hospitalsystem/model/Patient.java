package com.hospital.hospitalsystem.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "patients")
public class Patient {

    @Id
    private String id;

    @NotBlank
    private String name;

    @Email
    @Indexed(unique = true)
    private String email;

    private String password;

    private String phone;

    private Integer age;

    private String role = "ROLE_PATIENT";
}
