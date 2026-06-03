package com.hospital.hospitalsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchSuggestion {
    private String id;
    private String label;        // display text
    private String type;         // "DOCTOR", "HOSPITAL", "CITY", "SPECIALIZATION"
    private String subLabel;     // e.g., hospital city or specialization
    private String navigateTo;   // frontend route hint
}
