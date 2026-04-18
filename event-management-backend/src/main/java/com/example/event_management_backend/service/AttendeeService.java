package com.example.event_management_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.event_management_backend.model.Attendee;
import com.example.event_management_backend.repository.AttendeeRepository;

@Service
public class AttendeeService {

    @Autowired
    private AttendeeRepository repository;

    public Attendee register(Attendee attendee) {
        return repository.save(attendee);
    }

    public List<Attendee> getAllAttendees() {
        return repository.findAll();
    }
}
