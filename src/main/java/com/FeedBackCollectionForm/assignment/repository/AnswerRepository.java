package com.FeedBackCollectionForm.assignment.repository;

import com.FeedBackCollectionForm.assignment.model.Answer;
import com.FeedBackCollectionForm.assignment.model.Question;
import com.FeedBackCollectionForm.assignment.model.Response;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByResponse(Response response);
    
    List<Answer> findByQuestion(Question question);
    
    Optional<Answer> findByResponseAndQuestion(Response response, Question question);
    
    long countByQuestion(Question question);
}