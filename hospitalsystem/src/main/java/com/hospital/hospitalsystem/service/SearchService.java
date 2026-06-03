package com.hospital.hospitalsystem.service;

import com.hospital.hospitalsystem.dto.SearchSuggestion;
import com.hospital.hospitalsystem.model.Doctor;
import com.hospital.hospitalsystem.model.Hospital;
import com.hospital.hospitalsystem.repository.DoctorRepository;
import com.hospital.hospitalsystem.repository.HospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final DoctorRepository doctorRepository;
    private final HospitalRepository hospitalRepository;

    public List<SearchSuggestion> getSuggestions(String keyword) {
        if (keyword == null || keyword.trim().length() < 1) return List.of();

        String kw = keyword.trim();
        List<SearchSuggestion> results = new ArrayList<>();

        // Hospitals
        List<Hospital> hospitals = hospitalRepository.searchByNameOrCity(kw);
        for (Hospital h : hospitals) {
            results.add(new SearchSuggestion(
                    h.getId(),
                    h.getName(),
                    "HOSPITAL",
                    h.getCity(),
                    "/doctors?hospitalId=" + h.getId()
            ));
        }

        // Cities (deduplicated)
        hospitals.stream()
                .map(Hospital::getCity)
                .distinct()
                .filter(city -> city.toLowerCase().contains(kw.toLowerCase()))
                .forEach(city -> results.add(new SearchSuggestion(
                        null,
                        city,
                        "CITY",
                        "City",
                        "/doctors?city=" + city
                )));

        // Doctors
        List<Doctor> doctors = doctorRepository.searchByNameOrSpecialization(kw);
        for (Doctor d : doctors) {
            String hospitalName = "";
            if (d.getHospitalId() != null) {
                hospitalName = hospitalRepository.findById(d.getHospitalId())
                        .map(Hospital::getName).orElse("");
            }
            results.add(new SearchSuggestion(
                    d.getId(),
                    "Dr. " + d.getName(),
                    "DOCTOR",
                    d.getSpecialization() + (hospitalName.isEmpty() ? "" : " · " + hospitalName),
                    "/doctors/" + d.getId()
            ));
        }

        // Specializations (unique from doctors)
        doctors.stream()
                .map(Doctor::getSpecialization)
                .distinct()
                .filter(spec -> spec.toLowerCase().contains(kw.toLowerCase()))
                .forEach(spec -> results.add(new SearchSuggestion(
                        null,
                        spec,
                        "SPECIALIZATION",
                        "Specialization",
                        "/doctors?specialization=" + spec
                )));

        return results.stream().limit(10).collect(Collectors.toList());
    }

    public List<Object> globalSearch(String keyword) {
        List<Object> results = new ArrayList<>();
        results.addAll(hospitalRepository.searchByNameOrCity(keyword));
        results.addAll(doctorRepository.searchByNameOrSpecialization(keyword));
        return results;
    }
}
