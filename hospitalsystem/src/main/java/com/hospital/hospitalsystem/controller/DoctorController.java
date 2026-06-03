package com.hospital.hospitalsystem.controller;

import com.hospital.hospitalsystem.dto.DoctorResponse;
import com.hospital.hospitalsystem.model.Doctor;
import com.hospital.hospitalsystem.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping
    public ResponseEntity<List<DoctorResponse>> getAll() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<DoctorResponse>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(doctorService.search(keyword));
    }

    @GetMapping("/specialization")
    public ResponseEntity<List<DoctorResponse>> getBySpecialization(@RequestParam String name) {
        return ResponseEntity.ok(doctorService.getDoctorsBySpecialization(name));
    }

    @GetMapping("/{id}/available-slots")
    public ResponseEntity<List<String>> getAvailableSlots(
            @PathVariable String id,
            @RequestParam String date) {
        return ResponseEntity.ok(doctorService.getAvailableSlots(id, date));
    }

    @PostMapping
    public ResponseEntity<Doctor> addDoctor(@RequestBody Doctor doctor) {
        return ResponseEntity.ok(doctorService.addDoctor(doctor));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable String id, @RequestBody Doctor doctor) {
        return ResponseEntity.ok(doctorService.updateDoctor(id, doctor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteDoctor(@PathVariable String id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok(Map.of("message", "Doctor deleted"));
    }
}
