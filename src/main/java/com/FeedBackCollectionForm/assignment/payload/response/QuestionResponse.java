package com.FeedBackCollectionForm.assignment.payload.response;

import com.FeedBackCollectionForm.assignment.model.Question;
import com.FeedBackCollectionForm.assignment.model.QuestionType;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class QuestionResponse {
    private Long id;
    private String text;
    private QuestionType type;
    private Integer displayOrder;
    private Boolean required;
    private List<OptionResponse> options = new ArrayList<>();

    public void setId(Long id) {
        this.id = id;
    }

    public void setText(String text) {
        this.text = text;
    }

    public void setType(QuestionType type) {
        this.type = type;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public void setRequired(Boolean required) {
        this.required = required;
    }

    public void setOptions(List<OptionResponse> options) {
        this.options = options;
    }

    public static QuestionResponse fromEntity(Question question) {
        QuestionResponse response = new QuestionResponse();
        response.setId(question.getId());
        response.setText(question.getText());
        response.setType(question.getType());
        response.setDisplayOrder(question.getDisplayOrder());
        response.setRequired(question.getRequired());

        if (question.getType() == QuestionType.MULTIPLE_CHOICE) {
            response.setOptions(question.getOptions().stream()
                    .map(OptionResponse::fromEntity)
                    .collect(Collectors.toList()));
        }

        return response;
    }
}
