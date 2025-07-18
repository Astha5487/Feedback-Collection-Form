package com.FeedBackCollectionForm.assignment.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Request payload for the forgot password functionality.
 * Contains the username of the user who forgot their password.
 */
@Data
public class ForgotPasswordRequest {
    
    @NotBlank(message = "Username cannot be blank")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;
}