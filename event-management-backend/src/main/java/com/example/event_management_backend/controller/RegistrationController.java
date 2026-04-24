package com.example.event_management_backend.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.event_management_backend.model.Registration;
import com.example.event_management_backend.service.RegistrationService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/registrations")
public class RegistrationController {

    @Autowired
    private RegistrationService service;

    @PostMapping
    public Registration register(@RequestBody Registration registration) {
        return service.register(registration);
    }

    @GetMapping
    public List<Registration> getAllRegistrations() {
        return service.getAllRegistrations();
    }
}
