package com.FeedBackCollectionForm.assignment.controller;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Transactional
@RestController
@RequestMapping("/api")
public class HealthController {

    @PersistenceContext
    private EntityManager entityManager;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        System.out.println("Health check endpoint called at " + new Date());

        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Server is running");
        response.put("timestamp", new Date().toString());

        try {
            // Check DB connectivity
            try {
                Object result = entityManager.createNativeQuery("SELECT 1").getSingleResult();
                System.out.println("Database connection test successful, result: " + result);
                response.put("database", "connected");
            } catch (Exception dbError) {
                dbError.printStackTrace();
                System.err.println("Database connection failed: " + dbError.getMessage());
                response.put("database", "disconnected");
                response.put("dbMessage", "Database connection has issues");
            }

            System.out.println("Returning health response: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Unexpected error in health check: " + e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "UP");
            errorResponse.put("message", "Server is running with some issues");
            errorResponse.put("timestamp", new Date().toString());
            errorResponse.put("error", e.getMessage());

            return ResponseEntity.ok(errorResponse);
        }
    }

    @GetMapping("/ping")
    public ResponseEntity<Map<String, Object>> ping() {
        System.out.println("Ping endpoint called at " + new Date());

        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Server is running");
        response.put("timestamp", new Date().toString());

        return ResponseEntity.ok(response);
    }
}
