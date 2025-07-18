package com.FeedBackCollectionForm.assignment.repository;

import com.FeedBackCollectionForm.assignment.model.Option;
import com.FeedBackCollectionForm.assignment.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OptionRepository extends JpaRepository<Option, Long> {
    List<Option> findByQuestion(Question question);
    
    List<Option> findByQuestionOrderByDisplayOrderAsc(Question question);
}