package com.hospital.hospitalsystem.repository;

import com.hospital.hospitalsystem.model.Patient;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PatientRepository extends MongoRepository<Patient, String> {

    Optional<Patient> findByEmail(String email);

    boolean existsByEmail(String email);
}
