package com.hospital.hospitalsystem.service;

import com.hospital.hospitalsystem.dto.DoctorResponse;
import com.hospital.hospitalsystem.model.Doctor;
import com.hospital.hospitalsystem.model.Hospital;
import com.hospital.hospitalsystem.repository.AppointmentRepository;
import com.hospital.hospitalsystem.repository.DoctorRepository;
import com.hospital.hospitalsystem.repository.HospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final HospitalRepository hospitalRepository;
    private final AppointmentRepository appointmentRepository;

    public Doctor addDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public Doctor updateDoctor(String id, Doctor updated) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setName(updated.getName());
        doctor.setSpecialization(updated.getSpecialization());
        doctor.setExperience(updated.getExperience());
        doctor.setAvailableDays(updated.getAvailableDays());
        doctor.setAvailableTimeSlots(updated.getAvailableTimeSlots());
        doctor.setWorkingHours(updated.getWorkingHours());
        doctor.setHospitalId(updated.getHospitalId());
        return doctorRepository.save(doctor);
    }

    public void deleteDoctor(String id) {
        doctorRepository.deleteById(id);
    }

    public List<DoctorResponse> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<DoctorResponse> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecialization(specialization).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<DoctorResponse> search(String keyword) {
        return doctorRepository.searchByNameOrSpecialization(keyword).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public DoctorResponse getDoctorById(String id) {
        return doctorRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    /**
     * Return time slots for a doctor on a date, marking which are already booked.
     */
    public List<String> getAvailableSlots(String doctorId, String date) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        List<String> bookedTimes = appointmentRepository
                .findByDoctorIdAndAppointmentDate(doctorId, date)
                .stream()
                .filter(a -> !a.getStatus().equals("CANCELLED"))
                .map(a -> a.getAppointmentTime())
                .collect(Collectors.toList());

        if (doctor.getAvailableTimeSlots() == null) return List.of();

        return doctor.getAvailableTimeSlots().stream()
                .filter(slot -> !bookedTimes.contains(slot))
                .collect(Collectors.toList());
    }

    private DoctorResponse toResponse(Doctor doctor) {
        DoctorResponse r = new DoctorResponse();
        r.setId(doctor.getId());
        r.setName(doctor.getName());
        r.setSpecialization(doctor.getSpecialization());
        r.setExperience(doctor.getExperience());
        r.setAvailableDays(doctor.getAvailableDays());
        r.setAvailableTimeSlots(doctor.getAvailableTimeSlots());
        r.setWorkingHours(doctor.getWorkingHours());
        r.setHospitalId(doctor.getHospitalId());

        if (doctor.getHospitalId() != null) {
            hospitalRepository.findById(doctor.getHospitalId()).ifPresent(h -> {
                r.setHospitalName(h.getName());
                r.setHospitalCity(h.getCity());
            });
        }
        return r;
    }
}
