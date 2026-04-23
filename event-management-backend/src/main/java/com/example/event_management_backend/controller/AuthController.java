package com.example.event_management_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.event_management_backend.model.User;
import com.example.event_management_backend.repository.UserRepository;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email is already in use!");
        }
        
        // Force role to USER for all signups via this endpoint
        user.setRole("USER"); 
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Simple plaintext check for v2-prototype
            if (user.getPassword().equals(loginRequest.getPassword())) {
                return ResponseEntity.ok(user); // Send back the full user object (including role)
            }
        }
        
        return ResponseEntity.status(401).body("Invalid email or password!");
    }
}
