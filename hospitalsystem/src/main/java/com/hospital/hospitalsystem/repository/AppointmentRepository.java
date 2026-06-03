package com.hospital.hospitalsystem.repository;

import com.hospital.hospitalsystem.model.Appointment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends MongoRepository<Appointment, String> {

    List<Appointment> findByPatientId(String patientId);

    List<Appointment> findByDoctorId(String doctorId);

    Optional<Appointment> findByDoctorIdAndAppointmentDateAndAppointmentTime(
            String doctorId, String appointmentDate, String appointmentTime);

    List<Appointment> findByDoctorIdAndAppointmentDate(String doctorId, String appointmentDate);

    List<Appointment> findByAppointmentDate(String appointmentDate);

    long countByAppointmentDate(String appointmentDate);

    List<Appointment> findByPatientEmail(String email);
}
