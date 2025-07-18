package com.FeedBackCollectionForm.assignment.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for the root API endpoint.
 */
@RestController
@RequestMapping("/api")
public class RootController {

    /**
     * Root API endpoint that returns basic server information.
     * 
     * @return A response entity with server status information
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getApiInfo() {
        System.out.println("Root API endpoint called at " + new java.util.Date());

        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "API is running");
        response.put("version", "1.0");
        response.put("timestamp", new java.util.Date().toString());

        return ResponseEntity.ok(response);
    }
}