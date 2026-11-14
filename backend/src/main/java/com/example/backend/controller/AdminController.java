package com.example.backend.controller;

import com.example.backend.model.Bid;
import com.example.backend.model.Project;
import com.example.backend.model.User;
import com.example.backend.repository.BidRepository;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private BidRepository bidRepository;

    // Overview counts + lists
    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardData() {
        List<User> users = userRepository.findAll();
        List<Project> projects = projectRepository.findAll();
        List<Bid> bids = bidRepository.findAll();

        Map<String, Object> data = new HashMap<>();
        data.put("totalUsers", users.size());
        data.put("totalProjects", projects.size());
        data.put("totalBids", bids.size());
        data.put("users", users);
        data.put("projects", projects);
        return data;
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted");
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        projectRepository.deleteById(id);
        return ResponseEntity.ok("Project deleted");
    }
}