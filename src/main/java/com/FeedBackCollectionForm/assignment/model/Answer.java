package com.FeedBackCollectionForm.assignment.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "answers")
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "response_id", nullable = false)
    private Response response;

    public void setResponse(Response response) {
        this.response = response;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    public void setQuestion(Question question) {
        this.question = question;
    }

    public Question getQuestion() {
        return question;
    }

    @Column(columnDefinition = "TEXT")
    private String textAnswer;

    private Integer ratingValue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selected_option_id")
    private Option selectedOption;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "answer_selected_options",
        joinColumns = @JoinColumn(name = "answer_id"),
        inverseJoinColumns = @JoinColumn(name = "option_id")
    )
    private java.util.Set<Option> selectedOptions = new java.util.HashSet<>();
    
    private String dateValue;

    public Long getId() {
        return id;
    }

    public String getTextAnswer() {
        return textAnswer;
    }

    public Integer getRatingValue() {
        return ratingValue;
    }

    public Option getSelectedOption() {
        return selectedOption;
    }

    public void setSelectedOption(Option selectedOption) {
        this.selectedOption = selectedOption;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTextAnswer(String textAnswer) {
        this.textAnswer = textAnswer;
    }

    public void setRatingValue(Integer ratingValue) {
        this.ratingValue = ratingValue;
    }

    public Response getResponse() {
        return response;
    }
    
    public java.util.Set<Option> getSelectedOptions() {
        return selectedOptions;
    }
    
    public void setSelectedOptions(java.util.Set<Option> selectedOptions) {
        this.selectedOptions = selectedOptions;
    }
    
    public void addSelectedOption(Option option) {
        this.selectedOptions.add(option);
    }
    
    public void removeSelectedOption(Option option) {
        this.selectedOptions.remove(option);
    }
    
    public String getDateValue() {
        return dateValue;
    }
    
    public void setDateValue(String dateValue) {
        this.dateValue = dateValue;
    }
}
