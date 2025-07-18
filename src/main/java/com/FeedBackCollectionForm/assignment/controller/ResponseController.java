package com.FeedBackCollectionForm.assignment.controller;

import com.FeedBackCollectionForm.assignment.payload.request.ResponseRequest;
import com.FeedBackCollectionForm.assignment.payload.response.ResponseResponse;
import com.FeedBackCollectionForm.assignment.security.services.UserDetailsImpl;
import com.FeedBackCollectionForm.assignment.service.ResponseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", 
                      "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://127.0.0.1:5175"}, 
           maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api")
public class ResponseController {

    @Autowired
    private ResponseService responseService;

    @PostMapping("/forms/public/{publicUrl}/submit")
    public ResponseEntity<ResponseResponse> submitResponse(
            @PathVariable String publicUrl,
            @Valid @RequestBody ResponseRequest responseRequest) {
        ResponseResponse response = responseService.submitResponse(publicUrl, responseRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/forms/{formId}/responses")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<ResponseResponse>> getResponsesByForm(
            @PathVariable Long formId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<ResponseResponse> responses = responseService.getResponsesByForm(formId, userDetails.getUsername());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/responses/my")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<ResponseResponse>> getMyResponses(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<ResponseResponse> responses = responseService.getResponsesByEmail(userDetails.getEmail());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/responses/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ResponseResponse> getResponseById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        ResponseResponse response = responseService.getResponseById(id, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/responses/my/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ResponseResponse> getMyResponseById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        ResponseResponse response = responseService.getResponseByIdForRespondent(id, userDetails.getEmail());
        return ResponseEntity.ok(response);
    }

    /**
     * Download all responses for a form as CSV.
     * 
     * @param formId The ID of the form
     * @param userDetails The authenticated user details
     * @return A CSV file containing all responses
     */
    @GetMapping("/forms/{formId}/responses/download")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<byte[]> downloadFormResponses(
            @PathVariable Long formId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        String csvContent = responseService.generateCsvForForm(formId, userDetails.getUsername());
        byte[] csvBytes = csvContent.getBytes();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "form_responses_" + formId + ".csv");
        headers.setContentLength(csvBytes.length);

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvBytes);
    }

    /**
     * Download a specific response as CSV.
     * 
     * @param id The ID of the response
     * @param userDetails The authenticated user details
     * @return A CSV file containing the response
     */
    @GetMapping("/responses/{id}/download")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<byte[]> downloadResponse(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        String csvContent = responseService.generateCsvForResponse(id, userDetails.getUsername());
        byte[] csvBytes = csvContent.getBytes();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "response_" + id + ".csv");
        headers.setContentLength(csvBytes.length);

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvBytes);
    }

    /**
     * Download a respondent's response as CSV.
     * 
     * @param id The ID of the response
     * @param userDetails The authenticated user details
     * @return A CSV file containing the response
     */
    @GetMapping("/responses/my/{id}/download")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<byte[]> downloadMyResponse(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        String csvContent = responseService.generateCsvForRespondent(id, userDetails.getEmail());
        byte[] csvBytes = csvContent.getBytes();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "my_response_" + id + ".csv");
        headers.setContentLength(csvBytes.length);

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvBytes);
    }
}
