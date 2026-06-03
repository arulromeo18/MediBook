package com.hospital.hospitalsystem.controller;

import com.hospital.hospitalsystem.model.Hospital;
import com.hospital.hospitalsystem.service.HospitalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hospitals")
@RequiredArgsConstructor
public class HospitalController {

    private final HospitalService hospitalService;

    @GetMapping
    public ResponseEntity<List<Hospital>> getAll() {
        return ResponseEntity.ok(hospitalService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hospital> getById(@PathVariable String id) {
        return ResponseEntity.ok(hospitalService.getById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Hospital>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(hospitalService.search(keyword));
    }

    @PostMapping
    public ResponseEntity<Hospital> create(@RequestBody Hospital hospital) {
        return ResponseEntity.ok(hospitalService.save(hospital));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Hospital> update(@PathVariable String id, @RequestBody Hospital hospital) {
        hospital.setId(id);
        return ResponseEntity.ok(hospitalService.save(hospital));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable String id) {
        hospitalService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Hospital deleted"));
    }
}
