package com.event_management.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.event_management.model.Registration;
import com.event_management.repository.RegistrationRepository;

@RestController
@RequestMapping("/registrations")
@CrossOrigin(origins = "*")
public class RegistrationController {

    private final RegistrationRepository repo;

    public RegistrationController(RegistrationRepository repo) {
        this.repo = repo;
    }

    // ✅ GET all registrations
    @GetMapping
    public List<Registration> getAll() {
        return repo.findAll();
    }

    // ✅ POST register user to event (UPDATED)
    @PostMapping
    public Registration register(@RequestBody Registration reg) {

        // 🔴 Check duplicate registration
        if (repo.existsByUserIdAndEventId(
                reg.getUser().getId(),
                reg.getEvent().getId()
        )) {
            throw new RuntimeException("User already registered for this event!");
        }

        // ✅ Save and RETURN full object (IMPORTANT)
        return repo.save(reg);
    }
}