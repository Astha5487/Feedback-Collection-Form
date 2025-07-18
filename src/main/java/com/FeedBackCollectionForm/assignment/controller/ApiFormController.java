package com.FeedBackCollectionForm.assignment.controller;

import com.FeedBackCollectionForm.assignment.payload.request.FormRequest;
import com.FeedBackCollectionForm.assignment.payload.response.FormResponse;
import com.FeedBackCollectionForm.assignment.payload.response.MessageResponse;
import com.FeedBackCollectionForm.assignment.security.services.UserDetailsImpl;
import com.FeedBackCollectionForm.assignment.service.FormService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for handling API requests for forms.
 */
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", 
                      "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://127.0.0.1:5175"}, 
           maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/forms")
public class ApiFormController {

    @Autowired
    private FormService formService;

    /**
     * Creates a new form.
     * 
     * @param formRequest The form request data
     * @param userDetails The authenticated user details
     * @return A response entity with the created form
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<?> createForm(@Valid @RequestBody FormRequest formRequest,
                                                  @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            FormResponse form = formService.createForm(formRequest, userDetails.getUsername());
            return ResponseEntity.ok(form);
        } catch (Exception e) {
            System.err.println("Error creating form: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new MessageResponse("Failed to create form. Please try again later."));
        }
    }

    /**
     * Gets all forms for the authenticated user.
     * 
     * @param userDetails The authenticated user details
     * @return A response entity with a list of forms
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<?> getAllForms(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            List<FormResponse> forms = formService.getAllFormsByUser(userDetails.getUsername());
            return ResponseEntity.ok(forms);
        } catch (Exception e) {
            System.err.println("Error getting all forms: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(List.of()); // Return empty list instead of error
        }
    }

    /**
     * Gets a form by its ID.
     * 
     * @param id The form ID
     * @param userDetails The authenticated user details
     * @return A response entity with the form
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<?> getFormById(@PathVariable Long id,
                                                  @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            FormResponse form = formService.getFormById(id, userDetails.getUsername());
            return ResponseEntity.ok(form);
        } catch (Exception e) {
            System.err.println("Error getting form by ID: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new MessageResponse("Failed to load form. Please try again later."));
        }
    }

    /**
     * Deletes a form by its ID.
     * 
     * @param id The form ID
     * @param userDetails The authenticated user details
     * @return A response entity with a success message
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<MessageResponse> deleteForm(@PathVariable Long id,
                                                    @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            formService.deleteForm(id, userDetails.getUsername());
            return ResponseEntity.ok(new MessageResponse("Form deleted successfully"));
        } catch (Exception e) {
            System.err.println("Error deleting form: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new MessageResponse("Failed to delete form. Please try again later."));
        }
    }

    /**
     * Gets a form by its public URL.
     * 
     * @param publicUrl The form's public URL
     * @return A response entity with the form
     */
    @GetMapping("/public/{publicUrl}")
    public ResponseEntity<?> getFormByPublicUrl(@PathVariable String publicUrl) {
        try {
            FormResponse form = formService.getFormByPublicUrl(publicUrl);
            return ResponseEntity.ok(form);
        } catch (Exception e) {
            System.err.println("Error getting form by public URL: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new MessageResponse("Failed to load form. Please try again later."));
        }
    }
}
