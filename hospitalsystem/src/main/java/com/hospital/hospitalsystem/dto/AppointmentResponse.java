package com.hospital.hospitalsystem.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentResponse {
    private String id;
    private String patientId;
    private String patientName;
    private Integer patientAge;
    private String patientEmail;
    private String patientPhone;
    private String healthIssue;
    private String doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private String hospitalId;
    private String hospitalName;
    private String hospitalCity;
    private String appointmentDate;
    private String appointmentTime;
    private int tokenNumber;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
