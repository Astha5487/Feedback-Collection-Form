package com.FeedBackCollectionForm.assignment.controller;

import com.FeedBackCollectionForm.assignment.model.User;
import com.FeedBackCollectionForm.assignment.payload.request.UpdateProfileRequest;
import com.FeedBackCollectionForm.assignment.payload.response.MessageResponse;
import com.FeedBackCollectionForm.assignment.payload.response.UserProfileResponse;
import com.FeedBackCollectionForm.assignment.repository.UserRepository;
import com.FeedBackCollectionForm.assignment.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", 
                      "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://127.0.0.1:5175"}, 
           maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getUserProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Optional<User> userOptional = userRepository.findById(userDetails.getId());

        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found"));
        }

        User user = userOptional.get();

        UserProfileResponse profileResponse = new UserProfileResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getFullName(),
            user.getPhoneNo(),
            user.getProfilePicture(),
            user.getBio(),
            user.getLocation(),
            user.getOrganization()
        );

        return ResponseEntity.ok(profileResponse);
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateUserProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody UpdateProfileRequest profileRequest) {

        Optional<User> userOptional = userRepository.findById(userDetails.getId());

        if (!userOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found"));
        }

        User user = userOptional.get();

        // Update only the fields that are provided
        if (profileRequest.getFullName() != null) {
            user.setFullName(profileRequest.getFullName());
        }

        if (profileRequest.getPhoneNo() != null) {
            user.setPhoneNo(profileRequest.getPhoneNo());
        }

        if (profileRequest.getProfilePicture() != null) {
            user.setProfilePicture(profileRequest.getProfilePicture());
        }

        if (profileRequest.getBio() != null) {
            user.setBio(profileRequest.getBio());
        }

        if (profileRequest.getLocation() != null) {
            user.setLocation(profileRequest.getLocation());
        }

        if (profileRequest.getOrganization() != null) {
            user.setOrganization(profileRequest.getOrganization());
        }

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Profile updated successfully"));
    }
}
