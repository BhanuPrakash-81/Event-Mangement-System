package com.event_management.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.event_management.model.Event;
import com.event_management.repository.EventRepository;

@RestController
@RequestMapping("/events")
@CrossOrigin(origins = "*")
public class EventController {

    private final EventRepository repo;

    // Constructor Injection
    public EventController(EventRepository repo) {
        this.repo = repo;
    }

    // GET all events
    @GetMapping
    public List<Event> getEvents() {
        return repo.findAll();
    }

    // POST create event
    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return repo.save(event);
    }

    // PUT update event
    @org.springframework.web.bind.annotation.PutMapping("/{id}")
    public Event updateEvent(@org.springframework.web.bind.annotation.PathVariable Long id, @RequestBody Event updatedEvent) {
        return repo.findById(id).map(event -> {
            event.setTitle(updatedEvent.getTitle());
            event.setDescription(updatedEvent.getDescription());
            event.setVenue(updatedEvent.getVenue());
            event.setEventDate(updatedEvent.getEventDate());
            event.setMaxAttendees(updatedEvent.getMaxAttendees());
            if (updatedEvent.getPhoto() != null) {
                event.setPhoto(updatedEvent.getPhoto());
            }
            return repo.save(event);
        }).orElseThrow(() -> new RuntimeException("Event not found"));
    }

    // DELETE event
    @org.springframework.web.bind.annotation.DeleteMapping("/{id}")
    public void deleteEvent(@org.springframework.web.bind.annotation.PathVariable Long id) {
        repo.deleteById(id);
    }
}