package com.example.event_management_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.example.event_management_backend.model.User;
import com.example.event_management_backend.repository.UserRepository;

@SpringBootApplication
public class EventManagementBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(EventManagementBackendApplication.class, args);
	}

	@Bean
	CommandLineRunner initDatabase(UserRepository userRepository) {
		return args -> {
			if (!userRepository.existsByEmail("admin@admin.com")) {
				User admin = new User();
				admin.setName("System Admin");
				admin.setEmail("admin@admin.com");
				admin.setPassword("admin");
				admin.setRole("ADMIN");
				userRepository.save(admin);
				System.out.println("Default admin user created: admin@admin.com / admin");
			}

			if (!userRepository.existsByEmail("user@test.com")) {
				User testUser = new User();
				testUser.setName("Test User");
				testUser.setEmail("user@test.com");
				testUser.setPassword("user");
				testUser.setRole("USER");
				userRepository.save(testUser);
				System.out.println("Default test user created: user@test.com / user");
			}
		};
	}
}
