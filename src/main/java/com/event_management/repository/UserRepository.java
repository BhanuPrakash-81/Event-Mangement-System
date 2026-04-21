package com.event_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.event_management.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
