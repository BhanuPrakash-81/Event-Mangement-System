package com.example.event_management_backend.repository;

import com.example.event_management_backend.model.Attendee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendeeRepository extends JpaRepository<Attendee, Long> {
}
