package com.event_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.event_management.model.Registration;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    boolean existsByUserIdAndEventId(Long userId, Long eventId);
}