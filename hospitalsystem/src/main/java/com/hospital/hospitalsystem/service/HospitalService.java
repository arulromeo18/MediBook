package com.hospital.hospitalsystem.service;

import com.hospital.hospitalsystem.model.Hospital;
import com.hospital.hospitalsystem.repository.HospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HospitalService {

    private final HospitalRepository hospitalRepository;

    public List<Hospital> getAll() {
        return hospitalRepository.findAll();
    }

    public Hospital getById(String id) {
        return hospitalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hospital not found"));
    }

    public Hospital save(Hospital hospital) {
        return hospitalRepository.save(hospital);
    }

    public void delete(String id) {
        hospitalRepository.deleteById(id);
    }

    public List<Hospital> search(String keyword) {
        return hospitalRepository.searchByNameOrCity(keyword);
    }
}
