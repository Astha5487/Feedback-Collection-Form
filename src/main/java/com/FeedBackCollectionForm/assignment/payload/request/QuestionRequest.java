package com.FeedBackCollectionForm.assignment.payload.request;

import com.FeedBackCollectionForm.assignment.model.QuestionType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class QuestionRequest {
    @NotBlank
    @Size(max = 500)
    private String text;

    @NotNull
    private QuestionType type;

    private Integer displayOrder;

    private Boolean required = false;

    @Valid
    private List<OptionRequest> options = new ArrayList<>();

    public String getText() {
        return text;
    }

    public QuestionType getType() {
        return type;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public Boolean getRequired() {
        return required;
    }

    public List<OptionRequest> getOptions() {
        return options;
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

    public void setOptions(List<OptionRequest> options) {
        this.options = options;
    }
}
