package com.hospital.hospitalsystem.controller;

import com.hospital.hospitalsystem.model.Patient;
import com.hospital.hospitalsystem.service.AdminService;
import com.hospital.hospitalsystem.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final AppointmentService appointmentService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Long>> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> getPatients() {
        return ResponseEntity.ok(adminService.getAllPatients());
    }

    @GetMapping("/appointments")
    public ResponseEntity<?> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }
}
