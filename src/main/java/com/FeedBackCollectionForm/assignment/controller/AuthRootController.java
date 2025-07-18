package com.FeedBackCollectionForm.assignment.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for the auth API root endpoint.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthRootController {

    /**
     * Auth API root endpoint that returns basic auth service information.
     * 
     * @return A response entity with auth service status information
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAuthInfo() {
        System.out.println("Auth API root endpoint called at " + new java.util.Date());

        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Auth service is running");
        response.put("endpoints", new String[]{"signin", "signup", "forgot-password"});
        response.put("timestamp", new java.util.Date().toString());

        return ResponseEntity.ok(response);
    }
}