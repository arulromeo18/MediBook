package com.hospital.hospitalsystem.repository;

import com.hospital.hospitalsystem.model.Doctor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface DoctorRepository extends MongoRepository<Doctor, String> {

    @Query("{ 'specialization': { $regex: ?0, $options: 'i' } }")
    List<Doctor> findBySpecialization(String specialization);

    List<Doctor> findByHospitalId(String hospitalId);

    @Query("{ $or: [ " +
           "{ 'name': { $regex: ?0, $options: 'i' } }, " +
           "{ 'specialization': { $regex: ?0, $options: 'i' } } " +
           "] }")
    List<Doctor> searchByNameOrSpecialization(String keyword);
}
