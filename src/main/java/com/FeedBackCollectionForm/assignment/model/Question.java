package com.FeedBackCollectionForm.assignment.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 500)
    private String text;

    @NotNull
    @Enumerated(EnumType.STRING)
    private QuestionType type;

    private Integer displayOrder;

    private Boolean required = false;

    private Integer wordLimit;
    
    // Properties for RATING_SCALE
    private Integer minRating;
    private Integer maxRating;
    private Integer defaultRating;
    
    // Properties for DATE
    private String dateFormat;
    private String minDate;
    private String maxDate;
    
    private String description;

    public Long getId() {
        return id;
    }

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

    public Integer getWordLimit() {
        return wordLimit;
    }
    
    public Integer getMinRating() {
        return minRating;
    }
    
    public Integer getMaxRating() {
        return maxRating;
    }
    
    public Integer getDefaultRating() {
        return defaultRating;
    }
    
    public String getDateFormat() {
        return dateFormat;
    }
    
    public String getMinDate() {
        return minDate;
    }
    
    public String getMaxDate() {
        return maxDate;
    }
    
    public String getDescription() {
        return description;
    }

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

    public void setWordLimit(Integer wordLimit) {
        this.wordLimit = wordLimit;
    }
    
    public void setMinRating(Integer minRating) {
        this.minRating = minRating;
    }
    
    public void setMaxRating(Integer maxRating) {
        this.maxRating = maxRating;
    }
    
    public void setDefaultRating(Integer defaultRating) {
        this.defaultRating = defaultRating;
    }
    
    public void setDateFormat(String dateFormat) {
        this.dateFormat = dateFormat;
    }
    
    public void setMinDate(String minDate) {
        this.minDate = minDate;
    }
    
    public void setMaxDate(String maxDate) {
        this.maxDate = maxDate;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "form_id", nullable = false)
    private Form form;

    public void setForm(Form form) {
        this.form = form;
    }

    public Form getForm() {
        return form;
    }

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Option> options = new ArrayList<>();

    public List<Option> getOptions() {
        return options;
    }

    public void setOptions(List<Option> options) {
        this.options = options;
    }

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Answer> answers = new ArrayList<>();

    public List<Answer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<Answer> answers) {
        this.answers = answers;
    }

    // Helper methods to maintain bidirectional relationship
    public void addOption(Option option) {
        options.add(option);
        option.setQuestion(this);
    }

    public void removeOption(Option option) {
        options.remove(option);
        option.setQuestion(null);
    }

    public void addAnswer(Answer answer) {
        answers.add(answer);
        answer.setQuestion(this);
    }

    public void removeAnswer(Answer answer) {
        answers.remove(answer);
        answer.setQuestion(null);
    }
}
