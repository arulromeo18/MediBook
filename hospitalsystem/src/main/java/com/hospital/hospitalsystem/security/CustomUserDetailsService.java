package com.hospital.hospitalsystem.security;

import com.hospital.hospitalsystem.model.Patient;
import com.hospital.hospitalsystem.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final PatientRepository patientRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        return new User(
                patient.getEmail(),
                patient.getPassword(),
                List.of(new SimpleGrantedAuthority(patient.getRole()))
        );
    }
}
