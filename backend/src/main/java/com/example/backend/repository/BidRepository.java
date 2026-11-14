package com.example.backend.repository;

import com.example.backend.model.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByProjectId(Long projectId);
}