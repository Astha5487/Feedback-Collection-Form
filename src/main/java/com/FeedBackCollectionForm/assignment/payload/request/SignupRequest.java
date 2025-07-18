package com.FeedBackCollectionForm.assignment.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.ToString;

import java.util.Set;

@Data
@ToString(exclude = "password") // Exclude password from toString for security
public class SignupRequest {
    @NotBlank
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank
    @Size(max = 100)
    @Email
    private String email;

    @NotBlank
    @Size(max = 100)
    private String fullName;

    @Size(max = 20)
    private String phoneNo;

    private Set<String> roles;

    @NotBlank
    @Size(min = 8, max = 120)
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?\":{}|<>]).*$", message = "Password must contain at least one uppercase letter and one special character")
    private String password;

    // Custom toString method that excludes the password
    @Override
    public String toString() {
        return "SignupRequest(username=" + username + 
               ", email=" + email + 
               ", fullName=" + fullName + 
               ", phoneNo=" + phoneNo + 
               ", roles=" + roles + 
               ", password=[PROTECTED])";
    }
}
