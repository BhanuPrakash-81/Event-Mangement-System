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
	CommandLineRunner initDatabase(UserRepository userRepository, EventRepository eventRepository, org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
		return args -> {
			// 1. Create Default Users
			if (!userRepository.existsByEmail("admin@admin.com")) {
				User admin = new User();
				admin.setName("System Admin");
				admin.setEmail("admin@admin.com");
				admin.setPassword(passwordEncoder.encode("admin"));
				admin.setRole("ADMIN");
				userRepository.save(admin);
				System.out.println("Default admin user created");
			}

			if (!userRepository.existsByEmail("user@test.com")) {
				User testUser = new User();
				testUser.setName("Test User");
				testUser.setEmail("user@test.com");
				testUser.setPassword(passwordEncoder.encode("user"));
				testUser.setRole("USER");
				userRepository.save(testUser);
				System.out.println("Default test user created");
			}

			// 2. Create Mock Events
			if (eventRepository.count() == 0) {
				com.example.event_management_backend.model.Event e1 = new com.example.event_management_backend.model.Event();
				e1.setTitle("Global Tech Summit 2026");
				e1.setDescription("A gathering of tech pioneers from around the world to discuss the future of AI and space exploration.");
				e1.setVenue("Grand Convention Center, NY");
				e1.setEventDate("2026-06-15T10:00:00");
				e1.setMaxAttendees(500);
				e1.setStatus("UPCOMING");
				eventRepository.save(e1);

				com.example.event_management_backend.model.Event e2 = new com.example.event_management_backend.model.Event();
				e2.setTitle("Spring Hackathon");
				e2.setDescription("48 hours of intense coding, networking, and pizza. Build something that changes the world.");
				e2.setVenue("Innovation Hub");
				e2.setEventDate("2026-05-20T09:00:00");
				e2.setMaxAttendees(200);
				e2.setStatus("UPCOMING");
				eventRepository.save(e2);

				com.example.event_management_backend.model.Event e3 = new com.example.event_management_backend.model.Event();
				e3.setTitle("Charity Gala Dinner");
				e3.setDescription("A night of elegance and giving. All proceeds go to local education programs.");
				e3.setVenue("The Ritz Carlton");
				e3.setEventDate("2026-07-04T19:00:00");
				e3.setMaxAttendees(150);
				e3.setStatus("UPCOMING");
				eventRepository.save(e3);

				System.out.println("Mock events added to database");
			}
		};
	}
}
