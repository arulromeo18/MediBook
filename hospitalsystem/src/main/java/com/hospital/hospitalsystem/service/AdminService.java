package com.hospital.hospitalsystem.service;

import com.hospital.hospitalsystem.model.Patient;
import com.hospital.hospitalsystem.repository.AppointmentRepository;
import com.hospital.hospitalsystem.repository.DoctorRepository;
import com.hospital.hospitalsystem.repository.HospitalRepository;
import com.hospital.hospitalsystem.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final HospitalRepository hospitalRepository;

    public Map<String, Long> getDashboardStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalPatients", patientRepository.count());
        stats.put("totalDoctors", doctorRepository.count());
        stats.put("totalAppointments", appointmentRepository.count());
        stats.put("totalHospitals", hospitalRepository.count());
        stats.put("pendingAppointments", appointmentRepository.findAll().stream()
                .filter(a -> "PENDING".equals(a.getStatus())).count());
        stats.put("confirmedAppointments", appointmentRepository.findAll().stream()
                .filter(a -> "CONFIRMED".equals(a.getStatus())).count());
        stats.put("completedAppointments", appointmentRepository.findAll().stream()
                .filter(a -> "COMPLETED".equals(a.getStatus())).count());
        return stats;
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }
}
