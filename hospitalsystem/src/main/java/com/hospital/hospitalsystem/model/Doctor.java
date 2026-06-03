package com.hospital.hospitalsystem.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "doctors")
public class Doctor {

    @Id
    private String id;

    @Indexed
    private String name;

    @Indexed
    private String specialization;

    private int experience;

    private List<String> availableDays;

    // Hospital reference
    private String hospitalId;

    // Available time slots e.g. ["09:00", "09:30", "10:00", ... "12:30"]
    private List<String> availableTimeSlots;

    // Working hours display e.g. "09:00 AM - 01:00 PM"
    private String workingHours;
}
