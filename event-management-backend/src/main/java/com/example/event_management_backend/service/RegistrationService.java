package com.example.event_management_backend.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.event_management_backend.model.Registration;
import com.example.event_management_backend.repository.RegistrationRepository;

@Service
public class RegistrationService {

    @Autowired
    private RegistrationRepository repository;

    public Registration register(Registration registration) {
        return repository.save(registration);
    }

    public List<Registration> getAllRegistrations() {
        return repository.findAll();
    }
}
