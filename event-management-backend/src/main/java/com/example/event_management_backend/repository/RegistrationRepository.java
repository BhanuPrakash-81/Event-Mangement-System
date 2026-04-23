package com.example.event_management_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.event_management_backend.model.Registration;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
}
