package com.hospital.hospitalsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class HospitalsystemApplication {
    public static void main(String[] args) {
        SpringApplication.run(HospitalsystemApplication.class, args);
    }
}
