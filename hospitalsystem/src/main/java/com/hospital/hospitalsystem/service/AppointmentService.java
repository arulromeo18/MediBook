package com.hospital.hospitalsystem.service;

import com.hospital.hospitalsystem.dto.AppointmentResponse;
import com.hospital.hospitalsystem.dto.BookAppointmentRequest;
import com.hospital.hospitalsystem.model.Appointment;
import com.hospital.hospitalsystem.model.Doctor;
import com.hospital.hospitalsystem.model.Hospital;
import com.hospital.hospitalsystem.model.Patient;
import com.hospital.hospitalsystem.repository.AppointmentRepository;
import com.hospital.hospitalsystem.repository.DoctorRepository;
import com.hospital.hospitalsystem.repository.HospitalRepository;
import com.hospital.hospitalsystem.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final HospitalRepository hospitalRepository;
    private final PatientRepository patientRepository;

    public AppointmentResponse bookAppointment(BookAppointmentRequest req, String patientEmail) {
        // Validate doctor exists
        Doctor doctor = doctorRepository.findById(req.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Validate time slot is in doctor's available slots
        if (doctor.getAvailableTimeSlots() != null
                && !doctor.getAvailableTimeSlots().contains(req.getAppointmentTime())) {
            throw new RuntimeException("Selected time slot is not available for this doctor");
        }

        // Check for double booking
        boolean slotTaken = appointmentRepository
                .findByDoctorIdAndAppointmentDateAndAppointmentTime(
                        req.getDoctorId(), req.getAppointmentDate(), req.getAppointmentTime())
                .filter(a -> !a.getStatus().equals("CANCELLED"))
                .isPresent();

        if (slotTaken) {
            throw new RuntimeException("This slot is already booked. Please choose another time.");
        }

        // Generate daily token number
        int tokenNumber = generateDailyToken(req.getAppointmentDate());

        // Find patient ID by email
        String patientId = patientRepository.findByEmail(patientEmail)
                .map(Patient::getId)
                .orElse(null);

        Appointment appointment = new Appointment();
        appointment.setPatientId(patientId);
        appointment.setPatientName(req.getPatientName());
        appointment.setPatientAge(req.getPatientAge());
        appointment.setPatientEmail(req.getPatientEmail());
        appointment.setPatientPhone(req.getPatientPhone());
        appointment.setHealthIssue(req.getHealthIssue());
        appointment.setDoctorId(req.getDoctorId());
        appointment.setHospitalId(req.getHospitalId() != null ? req.getHospitalId() : doctor.getHospitalId());
        appointment.setAppointmentDate(req.getAppointmentDate());
        appointment.setAppointmentTime(req.getAppointmentTime());
        appointment.setTokenNumber(tokenNumber);
        appointment.setStatus("PENDING");

        try {
            Appointment saved = appointmentRepository.save(appointment);
            return toResponse(saved);
        } catch (DuplicateKeyException e) {
            throw new RuntimeException("This slot is already booked. Please choose another time.");
        }
    }

    private synchronized int generateDailyToken(String date) {
        long count = appointmentRepository.countByAppointmentDate(date);
        return (int) (count + 1);
    }

    public List<AppointmentResponse> getAppointmentsByPatient(String patientId) {
        return appointmentRepository.findByPatientId(patientId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<AppointmentResponse> getAppointmentsByPatientEmail(String email) {
        return appointmentRepository.findByPatientEmail(email)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<AppointmentResponse> getAllAppointments() {
        return appointmentRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public AppointmentResponse updateStatus(String id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(status.toUpperCase());
        return toResponse(appointmentRepository.save(appointment));
    }

    public AppointmentResponse cancelAppointment(String id) {
        return updateStatus(id, "CANCELLED");
    }

    public void deleteAppointment(String id) {
        appointmentRepository.deleteById(id);
    }

    private AppointmentResponse toResponse(Appointment a) {
        AppointmentResponse r = new AppointmentResponse();
        r.setId(a.getId());
        r.setPatientId(a.getPatientId());
        r.setPatientName(a.getPatientName());
        r.setPatientAge(a.getPatientAge());
        r.setPatientEmail(a.getPatientEmail());
        r.setPatientPhone(a.getPatientPhone());
        r.setHealthIssue(a.getHealthIssue());
        r.setDoctorId(a.getDoctorId());
        r.setHospitalId(a.getHospitalId());
        r.setAppointmentDate(a.getAppointmentDate());
        r.setAppointmentTime(a.getAppointmentTime());
        r.setTokenNumber(a.getTokenNumber());
        r.setStatus(a.getStatus());
        r.setCreatedAt(a.getCreatedAt());
        r.setUpdatedAt(a.getUpdatedAt());

        if (a.getDoctorId() != null) {
            doctorRepository.findById(a.getDoctorId()).ifPresent(d -> {
                r.setDoctorName(d.getName());
                r.setDoctorSpecialization(d.getSpecialization());
            });
        }
        if (a.getHospitalId() != null) {
            hospitalRepository.findById(a.getHospitalId()).ifPresent(h -> {
                r.setHospitalName(h.getName());
                r.setHospitalCity(h.getCity());
            });
        }
        return r;
    }
}
