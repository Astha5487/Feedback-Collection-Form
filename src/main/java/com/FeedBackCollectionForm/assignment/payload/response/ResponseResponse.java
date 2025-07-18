package com.FeedBackCollectionForm.assignment.payload.response;

import com.FeedBackCollectionForm.assignment.model.Response;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class ResponseResponse {
    private Long id;
    private String respondentName;
    private String respondentEmail;
    private LocalDateTime submittedAt;
    private Long formId;
    private String formTitle;
    private List<AnswerResponse> answers;

    public void setId(Long id) {
        this.id = id;
    }

    public void setRespondentName(String respondentName) {
        this.respondentName = respondentName;
    }

    public void setRespondentEmail(String respondentEmail) {
        this.respondentEmail = respondentEmail;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public void setFormId(Long formId) {
        this.formId = formId;
    }

    public void setFormTitle(String formTitle) {
        this.formTitle = formTitle;
    }

    public void setAnswers(List<AnswerResponse> answers) {
        this.answers = answers;
    }

    public static ResponseResponse fromEntity(Response response) {
        ResponseResponse responseDto = new ResponseResponse();
        responseDto.setId(response.getId());
        responseDto.setRespondentName(response.getRespondentName());
        responseDto.setRespondentEmail(response.getRespondentEmail());
        responseDto.setSubmittedAt(response.getSubmittedAt());
        responseDto.setFormId(response.getForm().getId());
        responseDto.setFormTitle(response.getForm().getTitle());

        // Convert answers to DTOs
        if (response.getAnswers() != null) {
            responseDto.setAnswers(response.getAnswers().stream()
                .map(AnswerResponse::fromEntity)
                .collect(Collectors.toList()));
        }

        return responseDto;
    }
}
