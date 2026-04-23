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

    public Event updateEvent(Long id, Event updatedEvent) {
        return repository.findById(id).map(event -> {
            event.setTitle(updatedEvent.getTitle());
            event.setDescription(updatedEvent.getDescription());
            event.setVenue(updatedEvent.getVenue());
            event.setEventDate(updatedEvent.getEventDate());
            event.setMaxAttendees(updatedEvent.getMaxAttendees());
            event.setStatus(updatedEvent.getStatus());
            event.setPhoto(updatedEvent.getPhoto());
            return repository.save(event);
        }).orElseThrow(() -> new RuntimeException("Event not found"));
    }

    public void deleteEvent(Long id) {
        repository.deleteById(id);
    }
}
