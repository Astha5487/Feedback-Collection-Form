package com.FeedBackCollectionForm.assignment.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Simple controller for testing API access.
 */
@RestController
@RequestMapping("/api/test")
public class TestController {

    /**
     * Simple test endpoint that returns a 200 OK response.
     * 
     * @return A response entity with a simple message
     */
    @GetMapping("/ping")
    public ResponseEntity<Map<String, Object>> ping() {
        System.out.println("Test ping endpoint called at " + new java.util.Date());

        try {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Pong! Server is responding");
            response.put("timestamp", new java.util.Date().toString());
            response.put("status", "UP");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error in ping endpoint: " + e.getMessage());
            e.printStackTrace();

            // Return a success response even if there's an error
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Pong! Server is responding with issues");
            errorResponse.put("timestamp", new java.util.Date().toString());
            errorResponse.put("status", "UP");

            return ResponseEntity.ok(errorResponse);
        }
    }
}
