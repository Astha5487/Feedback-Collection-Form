package com.FeedBackCollectionForm.assignment.payload.response;

import com.FeedBackCollectionForm.assignment.model.Form;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class FormResponse {
    private Long id;
    private String title;
    private String description;
    private String publicUrl;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<QuestionResponse> questions = new ArrayList<>();
    private long responseCount;

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPublicUrl(String publicUrl) {
        this.publicUrl = publicUrl;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setQuestions(List<QuestionResponse> questions) {
        this.questions = questions;
    }

    public void setResponseCount(long responseCount) {
        this.responseCount = responseCount;
    }

    public static FormResponse fromEntity(Form form, long responseCount) {
        FormResponse response = new FormResponse();
        response.setId(form.getId());
        response.setTitle(form.getTitle());
        response.setDescription(form.getDescription());
        response.setPublicUrl(form.getPublicUrl());
        response.setCreatedBy(form.getCreatedBy().getUsername());
        response.setCreatedAt(form.getCreatedAt());
        response.setUpdatedAt(form.getUpdatedAt());
        response.setQuestions(form.getQuestions().stream()
                .map(QuestionResponse::fromEntity)
                .collect(Collectors.toList()));
        response.setResponseCount(responseCount);
        return response;
    }
}
