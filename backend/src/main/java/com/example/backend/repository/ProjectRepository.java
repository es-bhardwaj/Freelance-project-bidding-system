package com.example.backend.repository;

import com.example.backend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByClientId(Long clientId);
    List<Project> findByStatus(String status);
    List<Project> findByFreelancerIdAndStatus(Long freelancerId, String status);
}