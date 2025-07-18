package com.FeedBackCollectionForm.assignment.payload.response;

import com.FeedBackCollectionForm.assignment.model.Answer;
import lombok.Data;

@Data
public class AnswerResponse {
    private Long id;
    private Long questionId;
    private String textAnswer;
    private Integer ratingValue;
    private Long selectedOptionId;

    public void setId(Long id) {
        this.id = id;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public void setTextAnswer(String textAnswer) {
        this.textAnswer = textAnswer;
    }

    public void setRatingValue(Integer ratingValue) {
        this.ratingValue = ratingValue;
    }

    public void setSelectedOptionId(Long selectedOptionId) {
        this.selectedOptionId = selectedOptionId;
    }

    public static AnswerResponse fromEntity(Answer answer) {
        AnswerResponse answerDto = new AnswerResponse();
        answerDto.setId(answer.getId());
        answerDto.setQuestionId(answer.getQuestion().getId());
        answerDto.setTextAnswer(answer.getTextAnswer());
        answerDto.setRatingValue(answer.getRatingValue());

        if (answer.getSelectedOption() != null) {
            answerDto.setSelectedOptionId(answer.getSelectedOption().getId());
        }

        return answerDto;
    }
}
