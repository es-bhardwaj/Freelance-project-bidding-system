package com.example.backend.controller;

import com.example.backend.model.Project;
import com.example.backend.model.User;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    // Client: Post a new project
    @PostMapping("/client/{clientId}")
    public ResponseEntity<?> createProject(@PathVariable Long clientId, @RequestBody Project project) {
        User client = userRepository.findById(clientId).orElseThrow();
        project.setClient(client);
        project.setStatus("OPEN");
        return ResponseEntity.ok(projectRepository.save(project));
    }

    // Client: View all their posted projects (OPEN, IN_PROGRESS, COMPLETED)
    @GetMapping("/client/{clientId}")
    public List<Project> getClientProjects(@PathVariable Long clientId) {
        return projectRepository.findByClientId(clientId);
    }

    // Client: Mark an IN_PROGRESS project as COMPLETED
    @PutMapping("/{projectId}/complete")
    public ResponseEntity<?> completeProject(@PathVariable Long projectId) {
        Project project = projectRepository.findById(projectId).orElseThrow();
        project.setStatus("COMPLETED");
        return ResponseEntity.ok(projectRepository.save(project));
    }

    // Freelancer: Browse all OPEN projects
    @GetMapping("/open")
    public List<Project> getOpenProjects() {
        return projectRepository.findByStatus("OPEN");
    }

    // Freelancer: Track IN_PROGRESS projects assigned to them
    @GetMapping("/freelancer/{freelancerId}/in-progress")
    public List<Project> getFreelancerActiveProjects(@PathVariable Long freelancerId) {
        return projectRepository.findByFreelancerIdAndStatus(freelancerId, "IN_PROGRESS");
    }
}