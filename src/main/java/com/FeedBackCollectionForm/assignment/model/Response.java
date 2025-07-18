package com.FeedBackCollectionForm.assignment.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "responses")
public class Response {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "form_id", nullable = false)
    private Form form;

    public void setForm(Form form) {
        this.form = form;
    }

    public Form getForm() {
        return form;
    }

    private String respondentEmail;

    private String respondentName;

    @Column(nullable = false)
    private LocalDateTime submittedAt;

    @OneToMany(mappedBy = "response", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Answer> answers = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public String getRespondentEmail() {
        return respondentEmail;
    }

    public String getRespondentName() {
        return respondentName;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public List<Answer> getAnswers() {
        return answers;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setRespondentEmail(String respondentEmail) {
        this.respondentEmail = respondentEmail;
    }

    public void setRespondentName(String respondentName) {
        this.respondentName = respondentName;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public void setAnswers(List<Answer> answers) {
        this.answers = answers;
    }

    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
    }

    // Helper methods to maintain bidirectional relationship
    public void addAnswer(Answer answer) {
        answers.add(answer);
        answer.setResponse(this);
    }

    public void removeAnswer(Answer answer) {
        answers.remove(answer);
        answer.setResponse(null);
    }
}
