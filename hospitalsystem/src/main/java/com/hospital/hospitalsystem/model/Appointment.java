package com.hospital.hospitalsystem.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "appointments")
@CompoundIndexes({
    @CompoundIndex(name = "doctor_date_time_unique",
                   def = "{'doctorId': 1, 'appointmentDate': 1, 'appointmentTime': 1}",
                   unique = true),
    @CompoundIndex(name = "date_token",
                   def = "{'appointmentDate': 1, 'tokenNumber': 1}")
})
public class Appointment {

    @Id
    private String id;

    // Patient info (denormalized for display)
    @Indexed
    private String patientId;
    private String patientName;
    private Integer patientAge;
    private String patientEmail;
    private String patientPhone;
    private String healthIssue;

    // Doctor & Hospital references
    @Indexed
    private String doctorId;
    private String hospitalId;

    // Appointment details
    private String appointmentDate;   // YYYY-MM-DD
    private String appointmentTime;   // HH:mm (24h)

    // Daily token number
    private int tokenNumber;

    // Status: PENDING, CONFIRMED, COMPLETED, CANCELLED
    private String status = "PENDING";

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
