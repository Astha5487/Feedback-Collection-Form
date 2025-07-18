package com.FeedBackCollectionForm.assignment.payload.request;

import lombok.Data;

@Data
public class AnswerRequest {
    private Long questionId;

    private String textAnswer;

    private Long selectedOptionId;

    private Integer ratingValue;

    public Long getQuestionId() {
        return questionId;
    }

    public String getTextAnswer() {
        return textAnswer;
    }

    public Long getSelectedOptionId() {
        return selectedOptionId;
    }

    public Integer getRatingValue() {
        return ratingValue;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public void setTextAnswer(String textAnswer) {
        this.textAnswer = textAnswer;
    }

    public void setSelectedOptionId(Long selectedOptionId) {
        this.selectedOptionId = selectedOptionId;
    }

    public void setRatingValue(Integer ratingValue) {
        this.ratingValue = ratingValue;
    }
}
