package com.hospital.hospitalsystem.repository;

import com.hospital.hospitalsystem.model.Hospital;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface HospitalRepository extends MongoRepository<Hospital, String> {

    @Query("{ $or: [ { 'name': { $regex: ?0, $options: 'i' } }, { 'city': { $regex: ?0, $options: 'i' } } ] }")
    List<Hospital> searchByNameOrCity(String keyword);

    @Query("{ 'city': { $regex: ?0, $options: 'i' } }")
    List<Hospital> findByCityIgnoreCase(String city);

    @Query("{ 'name': { $regex: ?0, $options: 'i' } }")
    List<Hospital> findByNameContainingIgnoreCase(String name);
}
