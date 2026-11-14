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

import java.util.List;

@RestController
@RequestMapping("/api/bids")
@CrossOrigin(origins = "*")
public class BidController {

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    // Freelancer: Submit a bid (message only) on an OPEN project
    @PostMapping("/project/{projectId}/freelancer/{freelancerId}")
    public ResponseEntity<?> submitBid(
            @PathVariable Long projectId,
            @PathVariable Long freelancerId,
            @RequestBody Bid bidRequest) {

        Project project = projectRepository.findById(projectId).orElseThrow();
        User freelancer = userRepository.findById(freelancerId).orElseThrow();

        Bid bid = new Bid();
        bid.setMessage(bidRequest.getMessage());
        bid.setStatus("PENDING");
        bid.setProject(project);
        bid.setFreelancer(freelancer);

        return ResponseEntity.ok(bidRepository.save(bid));
    }

    // Client: View all bids for a specific project
    @GetMapping("/project/{projectId}")
    public List<Bid> getProjectBids(@PathVariable Long projectId) {
        return bidRepository.findByProjectId(projectId);
    }

    // Client: Accept a bid -> sets Project to IN_PROGRESS, assigns freelancer, rejects other bids
    @PutMapping("/{bidId}/accept")
    public ResponseEntity<?> acceptBid(@PathVariable Long bidId) {
        Bid acceptedBid = bidRepository.findById(bidId).orElseThrow();
        Project project = acceptedBid.getProject();

        // Update project
        project.setStatus("IN_PROGRESS");
        project.setFreelancer(acceptedBid.getFreelancer());
        projectRepository.save(project);

        // Update all bids for this project
        List<Bid> allBids = bidRepository.findByProjectId(project.getId());
        for (Bid b : allBids) {
            if (b.getId().equals(bidId)) {
                b.setStatus("ACCEPTED");
            } else {
                b.setStatus("REJECTED");
            }
            bidRepository.save(b);
        }

        return ResponseEntity.ok(acceptedBid);
    }
}