package com.FeedBackCollectionForm.assignment.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler for the application.
 * Handles various exceptions and returns appropriate responses.
 */
@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    // Removed custom handler for MethodArgumentNotValidException to avoid conflict with ResponseEntityExceptionHandler
    // The parent class ResponseEntityExceptionHandler already provides a handler for this exception

    /**
     * Handles role not found exceptions.
     * 
     * @param ex The role not found exception
     * @param request The web request
     * @return A response entity with error details
     */
    @ExceptionHandler(RoleNotFoundException.class)
    public ResponseEntity<Object> handleRoleNotFoundException(
            RoleNotFoundException ex, WebRequest request) {

        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", new Date());
        response.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.put("error", "Role Not Found");
        response.put("message", ex.getMessage());
        response.put("path", request.getDescription(false));

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Handles runtime exceptions.
     * 
     * @param ex The runtime exception
     * @param request The web request
     * @return A response entity with error details
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Object> handleRuntimeException(
            RuntimeException ex, WebRequest request) {

        System.err.println("Runtime exception caught by GlobalExceptionHandler: " + ex.getMessage());
        ex.printStackTrace();

        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", new Date());
        response.put("status", HttpStatus.OK.value());
        response.put("error", "Internal Server Error");

        // Check if this is a database connection issue
        String message = ex.getMessage();
        if (message != null && (
                message.contains("database") || 
                message.contains("Database") || 
                message.contains("connection") || 
                message.contains("Connection") ||
                message.contains("SQL") ||
                message.contains("jdbc") ||
                message.contains("JDBC") ||
                message.contains("H2"))) {
            System.err.println("Database connection issue detected: " + message);
            response.put("message", "Database connection issue. Please try again later.");
            response.put("originalError", message);
        } else {
            response.put("message", ex.getMessage());
        }

        response.put("path", request.getDescription(false));

        // Return 200 OK with error details to avoid frontend issues
        return ResponseEntity.ok(response);
    }

    /**
     * Catch-all handler for any exceptions not handled by other handlers.
     * 
     * @param ex The exception
     * @param request The web request
     * @return A response entity with error details
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleAllExceptions(
            Exception ex, WebRequest request) {

        System.err.println("Exception caught by GlobalExceptionHandler: " + ex.getMessage());
        ex.printStackTrace();

        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", new Date());
        response.put("status", HttpStatus.OK.value());
        response.put("error", "Error");

        // Check if this is a database connection issue
        String message = ex.getMessage();
        if (message != null && (
                message.contains("database") || 
                message.contains("Database") || 
                message.contains("connection") || 
                message.contains("Connection") ||
                message.contains("SQL") ||
                message.contains("jdbc") ||
                message.contains("JDBC") ||
                message.contains("H2"))) {
            System.err.println("Database connection issue detected: " + message);
            response.put("message", "Database connection issue. Please try again later.");
            response.put("originalError", message);
        } else {
            response.put("message", "An unexpected error occurred. Please try again later.");
            response.put("originalError", ex.getMessage());
        }

        response.put("path", request.getDescription(false));

        // Return 200 OK with error details to avoid frontend issues
        return ResponseEntity.ok(response);
    }
}
