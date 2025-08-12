package com.example.student_api;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
    // JpaRepository provides CRUD methods automatically
}

