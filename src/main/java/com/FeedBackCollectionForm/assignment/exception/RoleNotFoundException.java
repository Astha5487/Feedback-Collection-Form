package com.FeedBackCollectionForm.assignment.exception;

/**
 * Exception thrown when a required role is not found in the database.
 * This can happen if the database is not properly initialized.
 */
public class RoleNotFoundException extends RuntimeException {
    
    /**
     * Constructs a new RoleNotFoundException with the specified detail message.
     *
     * @param message the detail message
     */
    public RoleNotFoundException(String message) {
        super(message);
    }
    
    /**
     * Constructs a new RoleNotFoundException with the specified detail message and cause.
     *
     * @param message the detail message
     * @param cause the cause
     */
    public RoleNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}