package com.hospital.hospitalsystem.controller;

import com.hospital.hospitalsystem.dto.AppointmentResponse;
import com.hospital.hospitalsystem.dto.BookAppointmentRequest;
import com.hospital.hospitalsystem.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<?> book(@Valid @RequestBody BookAppointmentRequest req,
                                  @AuthenticationPrincipal UserDetails userDetails) {
        try {
            String email = userDetails != null ? userDetails.getUsername() : req.getPatientEmail();
            AppointmentResponse response = appointmentService.bookAppointment(req, email);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<AppointmentResponse>> getByPatient(@PathVariable String patientId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(patientId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<AppointmentResponse>> getMine(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                appointmentService.getAppointmentsByPatientEmail(userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<AppointmentResponse>> getAll() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<AppointmentResponse> cancel(@PathVariable String id) {
        return ResponseEntity.ok(appointmentService.cancelAppointment(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id,
                                          @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(appointmentService.updateStatus(id, body.get("status")));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable String id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok(Map.of("message", "Appointment deleted"));
    }
}
