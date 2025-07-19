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
    
    // For TEXT_WITH_LIMIT
    private Integer wordLimit;
    
    // For RATING_SCALE
    private Integer minRating;
    private Integer maxRating;
    private Integer defaultRating;
    
    // For DATE
    private String dateFormat;
    private String minDate;
    private String maxDate;
    
    // Description/help text for the question
    private String description;

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
    
    public Integer getWordLimit() {
        return wordLimit;
    }
    
    public void setWordLimit(Integer wordLimit) {
        this.wordLimit = wordLimit;
    }
    
    public Integer getMinRating() {
        return minRating;
    }
    
    public void setMinRating(Integer minRating) {
        this.minRating = minRating;
    }
    
    public Integer getMaxRating() {
        return maxRating;
    }
    
    public void setMaxRating(Integer maxRating) {
        this.maxRating = maxRating;
    }
    
    public Integer getDefaultRating() {
        return defaultRating;
    }
    
    public void setDefaultRating(Integer defaultRating) {
        this.defaultRating = defaultRating;
    }
    
    public String getDateFormat() {
        return dateFormat;
    }
    
    public void setDateFormat(String dateFormat) {
        this.dateFormat = dateFormat;
    }
    
    public String getMinDate() {
        return minDate;
    }
    
    public void setMinDate(String minDate) {
        this.minDate = minDate;
    }
    
    public String getMaxDate() {
        return maxDate;
    }
    
    public void setMaxDate(String maxDate) {
        this.maxDate = maxDate;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
}
