package com.example.event_management_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.event_management_backend.model.Attendee;
import com.example.event_management_backend.service.AttendeeService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/attendees")

public class AttendeeController {

    @Autowired
    private AttendeeService service;

    @PostMapping
    public Attendee register(@RequestBody Attendee attendee) {
        return service.register(attendee);
    }

    @GetMapping
    public List<Attendee> getAllAttendees() {
        return service.getAllAttendees();
    }
}
