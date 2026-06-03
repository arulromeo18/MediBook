package com.hospital.hospitalsystem.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookAppointmentRequest {

    @NotBlank(message = "Patient name is required")
    private String patientName;

    @NotNull(message = "Patient age is required")
    private Integer patientAge;

    @Email(message = "Valid email is required")
    @NotBlank(message = "Patient email is required")
    private String patientEmail;

    @NotBlank(message = "Patient phone is required")
    private String patientPhone;

    @NotBlank(message = "Health issue description is required")
    private String healthIssue;

    @NotBlank(message = "Doctor ID is required")
    private String doctorId;

    private String hospitalId;

    @NotBlank(message = "Appointment date is required")
    private String appointmentDate;  // YYYY-MM-DD

    @NotBlank(message = "Appointment time is required")
    private String appointmentTime;  // HH:mm
}
