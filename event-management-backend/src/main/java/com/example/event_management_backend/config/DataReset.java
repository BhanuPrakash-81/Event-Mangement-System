package com.example.event_management_backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import com.example.event_management_backend.repository.*;

@Configuration
public class DataReset {

    @Bean
    @Order(1) // Run this BEFORE initDatabase
    CommandLineRunner cleanDatabase(UserRepository userRepo, EventRepository eventRepo, RegistrationRepository regRepo) {
        return args -> {
            System.out.println(">>> STARTING DATABASE CLEANUP <<<");
            
            regRepo.deleteAll(); // Delete registrations first (foreign keys)
            System.out.println("Cleared Registrations");
            
            eventRepo.deleteAll();
            System.out.println("Cleared Events");
            
            userRepo.deleteAll();
            System.out.println("Cleared Users");
            
            System.out.println(">>> DATABASE CLEANUP COMPLETE <<<");
        };
    }
}
