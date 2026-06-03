package com.hospital.hospitalsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String id;
    private String token;
    private String role;
    private String name;
    private String email;
}
