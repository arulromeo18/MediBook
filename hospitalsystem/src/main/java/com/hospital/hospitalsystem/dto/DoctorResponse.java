package com.hospital.hospitalsystem.dto;

import lombok.Data;

import java.util.List;

@Data
public class DoctorResponse {
    private String id;
    private String name;
    private String specialization;
    private int experience;
    private List<String> availableDays;
    private List<String> availableTimeSlots;
    private String workingHours;
    private String hospitalId;
    private String hospitalName;
    private String hospitalCity;
}
