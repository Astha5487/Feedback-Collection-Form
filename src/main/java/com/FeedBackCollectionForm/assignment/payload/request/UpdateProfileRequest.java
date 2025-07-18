package com.FeedBackCollectionForm.assignment.payload.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    
    @Size(max = 100)
    private String fullName;
    
    @Size(max = 20)
    private String phoneNo;
    
    @Size(max = 255)
    private String profilePicture;
    
    @Size(max = 500)
    private String bio;
    
    @Size(max = 100)
    private String location;
    
    @Size(max = 100)
    private String organization;
}