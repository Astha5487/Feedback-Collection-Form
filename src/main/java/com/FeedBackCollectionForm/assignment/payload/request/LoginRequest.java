package com.FeedBackCollectionForm.assignment.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.ToString;

@Data
@ToString(exclude = "password") // Exclude password from toString for security
public class LoginRequest {
    @NotBlank
    private String username;

    @NotBlank
    private String password;

    // Custom toString method that excludes the password
    @Override
    public String toString() {
        return "LoginRequest(username=" + username + ", password=[PROTECTED])";
    }
}
