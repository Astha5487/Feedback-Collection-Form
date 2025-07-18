package com.FeedBackCollectionForm.assignment.payload.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ResponseRequest {
    @Size(max = 100)
    private String respondentName;

    @Size(max = 100)
    @Email
    private String respondentEmail;

    @Valid
    private List<AnswerRequest> answers = new ArrayList<>();

    public String getRespondentName() {
        return respondentName;
    }

    public String getRespondentEmail() {
        return respondentEmail;
    }

    public List<AnswerRequest> getAnswers() {
        return answers;
    }

    public void setRespondentName(String respondentName) {
        this.respondentName = respondentName;
    }

    public void setRespondentEmail(String respondentEmail) {
        this.respondentEmail = respondentEmail;
    }

    public void setAnswers(List<AnswerRequest> answers) {
        this.answers = answers;
    }
}
