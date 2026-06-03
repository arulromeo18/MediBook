package com.hospital.hospitalsystem.service;

import com.hospital.hospitalsystem.dto.*;
import com.hospital.hospitalsystem.model.Patient;
import com.hospital.hospitalsystem.repository.PatientRepository;
import com.hospital.hospitalsystem.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (patientRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        Patient patient = new Patient();
        patient.setName(request.getName());
        patient.setEmail(request.getEmail());
        patient.setPassword(passwordEncoder.encode(request.getPassword()));
        patient.setPhone(request.getPhone());
        patient.setAge(request.getAge());
        patient.setRole("ROLE_PATIENT");

        patientRepository.save(patient);

        String token = jwtUtil.generateToken(patient.getEmail(), patient.getRole());
        return new AuthResponse(patient.getId(), token, patient.getRole(), patient.getName(), patient.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception e) {
            throw new RuntimeException("Invalid email or password");
        }

        Patient patient = patientRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(patient.getEmail(), patient.getRole());
        return new AuthResponse(patient.getId(), token, patient.getRole(), patient.getName(), patient.getEmail());
    }
}
