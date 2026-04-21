package com.event_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.event_management.model.Event;

public interface EventRepository extends JpaRepository<Event, Long> {
}