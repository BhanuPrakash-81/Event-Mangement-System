package com.example.event_management_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.event_management_backend.model.Event;
import com.example.event_management_backend.repository.EventRepository;

@Service
public class EventService {

    @Autowired
    private EventRepository repository;

    public Event createEvent(Event event) {
        return repository.save(event);
    }

    public List<Event> getAllEvents() {
        return repository.findAll();
    }
}
