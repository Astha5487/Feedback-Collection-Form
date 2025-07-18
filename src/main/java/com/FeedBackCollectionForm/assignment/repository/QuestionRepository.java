package com.FeedBackCollectionForm.assignment.repository;

import com.FeedBackCollectionForm.assignment.model.Form;
import com.FeedBackCollectionForm.assignment.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByForm(Form form);
    
    List<Question> findByFormOrderByDisplayOrderAsc(Form form);
}